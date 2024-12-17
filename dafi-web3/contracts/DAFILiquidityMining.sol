// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DAFILiquidityMining is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Pool {
        IERC20 lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accRewardPerShare;
        uint256 totalStaked;
    }

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 boostMultiplier;
        uint256 lockEndBlock;
    }

    IERC20 public rewardToken;
    uint256 public rewardPerBlock;
    uint256 public constant BOOST_PRECISION = 10000;
    uint256 public constant MAXIMUM_BOOST = 20000; // 2x boost maximum

    Pool[] public pools;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    mapping(address => uint256) public userTotalStaked;
    
    uint256 public totalAllocPoint;
    uint256 public startBlock;
    uint256 public constant BLOCKS_PER_WEEK = 40320; // Approximately 1 week in blocks

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event RewardPaid(address indexed user, uint256 indexed pid, uint256 amount);
    event BoostMultiplierUpdated(address indexed user, uint256 indexed pid, uint256 multiplier);

    constructor(
        IERC20 _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _startBlock
    ) {
        rewardToken = _rewardToken;
        rewardPerBlock = _rewardPerBlock;
        startBlock = _startBlock;
    }

    function addPool(
        uint256 _allocPoint,
        IERC20 _lpToken,
        bool _withUpdate
    ) external onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        pools.push(Pool({
            lpToken: _lpToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accRewardPerShare: 0,
            totalStaked: 0
        }));
    }

    function updatePool(uint256 _pid) public {
        Pool storage pool = pools[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        if (pool.totalStaked == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = block.number.sub(pool.lastRewardBlock);
        uint256 reward = multiplier.mul(rewardPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        pool.accRewardPerShare = pool.accRewardPerShare.add(
            reward.mul(1e12).div(pool.totalStaked)
        );
        pool.lastRewardBlock = block.number;
    }

    function deposit(uint256 _pid, uint256 _amount, uint256 _lockDuration) external nonReentrant {
        Pool storage pool = pools[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accRewardPerShare).div(1e12).sub(user.rewardDebt);
            if (pending > 0) {
                safeRewardTransfer(msg.sender, pending);
                emit RewardPaid(msg.sender, _pid, pending);
            }
        }
        
        if (_amount > 0) {
            pool.lpToken.transferFrom(msg.sender, address(this), _amount);
            user.amount = user.amount.add(_amount);
            pool.totalStaked = pool.totalStaked.add(_amount);
            userTotalStaked[msg.sender] = userTotalStaked[msg.sender].add(_amount);
            
            // Apply lock boost
            if (_lockDuration > 0) {
                uint256 boost = calculateBoost(_lockDuration);
                user.boostMultiplier = boost;
                user.lockEndBlock = block.number.add(_lockDuration);
                emit BoostMultiplierUpdated(msg.sender, _pid, boost);
            }
        }
        
        user.rewardDebt = user.amount.mul(pool.accRewardPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        Pool storage pool = pools[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not enough balance");
        require(block.number >= user.lockEndBlock, "withdraw: tokens still locked");
        
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accRewardPerShare).div(1e12).sub(user.rewardDebt);
        
        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.totalStaked = pool.totalStaked.sub(_amount);
            userTotalStaked[msg.sender] = userTotalStaked[msg.sender].sub(_amount);
            pool.lpToken.transfer(msg.sender, _amount);
        }
        
        if (pending > 0) {
            safeRewardTransfer(msg.sender, pending);
            emit RewardPaid(msg.sender, _pid, pending);
        }
        
        user.rewardDebt = user.amount.mul(pool.accRewardPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    function calculateBoost(uint256 _lockDuration) public pure returns (uint256) {
        uint256 numWeeks = _lockDuration.div(BLOCKS_PER_WEEK);
        // Maximum boost is 2x for 52 weeks lock
        uint256 boost = BOOST_PRECISION.add(
            numWeeks.mul(BOOST_PRECISION).div(52)
        );
        return boost > MAXIMUM_BOOST ? MAXIMUM_BOOST : boost;
    }

    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        Pool storage pool = pools[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accRewardPerShare = pool.accRewardPerShare;
        
        if (block.number > pool.lastRewardBlock && pool.totalStaked != 0) {
            uint256 multiplier = block.number.sub(pool.lastRewardBlock);
            uint256 reward = multiplier.mul(rewardPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accRewardPerShare = accRewardPerShare.add(reward.mul(1e12).div(pool.totalStaked));
        }
        
        uint256 baseReward = user.amount.mul(accRewardPerShare).div(1e12).sub(user.rewardDebt);
        return baseReward.mul(user.boostMultiplier).div(BOOST_PRECISION);
    }

    function massUpdatePools() public {
        uint256 length = pools.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    function safeRewardTransfer(address _to, uint256 _amount) internal {
        uint256 rewardBal = rewardToken.balanceOf(address(this));
        if (_amount > rewardBal) {
            rewardToken.transfer(_to, rewardBal);
        } else {
            rewardToken.transfer(_to, _amount);
        }
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        massUpdatePools();
        rewardPerBlock = _rewardPerBlock;
    }

    function updatePoolAllocPoint(uint256 _pid, uint256 _allocPoint, bool _withUpdate) external onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(pools[_pid].allocPoint).add(_allocPoint);
        pools[_pid].allocPoint = _allocPoint;
    }
}
