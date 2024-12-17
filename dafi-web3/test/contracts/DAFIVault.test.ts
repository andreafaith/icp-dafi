import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DAFIVault, DAFIToken } from "../../typechain";

describe("DAFIVault", function () {
  let dafiVault: DAFIVault;
  let dafiToken: DAFIToken;
  let owner: SignerWithAddress;
  let investor: SignerWithAddress;
  let farmer: SignerWithAddress;

  const testAsset = {
    totalShares: 1000,
    pricePerShare: ethers.utils.parseEther("100"),
  };

  beforeEach(async function () {
    [owner, investor, farmer] = await ethers.getSigners();

    // Deploy DAFI Token
    const DAFIToken = await ethers.getContractFactory("DAFIToken");
    dafiToken = await DAFIToken.deploy();
    await dafiToken.deployed();

    // Deploy DAFI Vault
    const DAFIVault = await ethers.getContractFactory("DAFIVault");
    dafiVault = await DAFIVault.deploy(dafiToken.address);
    await dafiVault.deployed();

    // Mint tokens for testing
    await dafiToken.mint(investor.address, ethers.utils.parseEther("10000"));
    await dafiToken.connect(investor).approve(dafiVault.address, ethers.constants.MaxUint256);
  });

  describe("Asset Creation", function () {
    it("Should create new asset", async function () {
      await expect(
        dafiVault.createAsset(testAsset.totalShares, testAsset.pricePerShare)
      )
        .to.emit(dafiVault, "AssetCreated")
        .withArgs(1, testAsset.totalShares, testAsset.pricePerShare);

      const asset = await dafiVault.getAssetDetails(1);
      expect(asset.totalShares).to.equal(testAsset.totalShares);
      expect(asset.pricePerShare).to.equal(testAsset.pricePerShare);
    });

    it("Should not allow non-owner to create asset", async function () {
      await expect(
        dafiVault.connect(investor).createAsset(testAsset.totalShares, testAsset.pricePerShare)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Investments", function () {
    beforeEach(async function () {
      await dafiVault.createAsset(testAsset.totalShares, testAsset.pricePerShare);
    });

    it("Should allow investment", async function () {
      const shares = 100;
      const investmentAmount = shares * Number(testAsset.pricePerShare);

      await expect(dafiVault.connect(investor).invest(1, shares))
        .to.emit(dafiVault, "InvestmentMade")
        .withArgs(investor.address, 1, investmentAmount, shares);

      const investment = await dafiVault.getInvestmentDetails(investor.address, 1);
      expect(investment.shares).to.equal(shares);
      expect(investment.amount).to.equal(investmentAmount);
    });

    it("Should not allow investment above available shares", async function () {
      const shares = testAsset.totalShares + 1;
      await expect(
        dafiVault.connect(investor).invest(1, shares)
      ).to.be.revertedWith("Insufficient available shares");
    });

    it("Should not allow investment below minimum", async function () {
      const shares = 1;
      await expect(
        dafiVault.connect(investor).invest(1, shares)
      ).to.be.revertedWith("Investment below minimum");
    });
  });

  describe("Returns Distribution", function () {
    beforeEach(async function () {
      await dafiVault.createAsset(testAsset.totalShares, testAsset.pricePerShare);
      await dafiVault.connect(investor).invest(1, 100);
    });

    it("Should distribute returns", async function () {
      const returnAmount = ethers.utils.parseEther("1000");
      await dafiToken.mint(owner.address, returnAmount);
      await dafiToken.approve(dafiVault.address, returnAmount);

      await expect(dafiVault.distributeReturns(1, returnAmount))
        .to.emit(dafiVault, "ReturnsDistributed")
        .withArgs(1, returnAmount);
    });

    it("Should allow return withdrawal", async function () {
      const returnAmount = ethers.utils.parseEther("1000");
      await dafiToken.mint(owner.address, returnAmount);
      await dafiToken.approve(dafiVault.address, returnAmount);
      await dafiVault.distributeReturns(1, returnAmount);

      await expect(dafiVault.connect(investor).withdrawReturns(1))
        .to.emit(dafiVault, "ReturnsWithdrawn")
        .withArgs(investor.address, 1, returnAmount);
    });
  });

  describe("Investment Withdrawal", function () {
    beforeEach(async function () {
      await dafiVault.createAsset(testAsset.totalShares, testAsset.pricePerShare);
      await dafiVault.connect(investor).invest(1, 100);
    });

    it("Should not allow withdrawal before lock period", async function () {
      await expect(
        dafiVault.connect(investor).withdrawInvestment(1)
      ).to.be.revertedWith("Lock period not ended");
    });

    it("Should allow withdrawal after lock period", async function () {
      // Advance time by 31 days
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const investment = await dafiVault.getInvestmentDetails(investor.address, 1);
      await expect(dafiVault.connect(investor).withdrawInvestment(1))
        .to.emit(dafiVault, "InvestmentWithdrawn")
        .withArgs(investor.address, 1, investment.amount);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause", async function () {
      await dafiVault.pause();
      expect(await dafiVault.paused()).to.equal(true);
    });

    it("Should not allow investments when paused", async function () {
      await dafiVault.pause();
      await expect(
        dafiVault.connect(investor).invest(1, 100)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow owner to withdraw in emergency", async function () {
      const amount = ethers.utils.parseEther("1000");
      await dafiToken.transfer(dafiVault.address, amount);
      await dafiVault.emergencyWithdraw(dafiToken.address);
      expect(await dafiToken.balanceOf(owner.address)).to.equal(amount);
    });
  });
});
