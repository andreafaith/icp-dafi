import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { 
  DAFIToken,
  FarmAssetToken,
  DAFIVault,
  DAFIMarketplace
} from "../../typechain";

describe("Farm Investment Flow", function () {
  let dafiToken: DAFIToken;
  let farmAssetToken: FarmAssetToken;
  let dafiVault: DAFIVault;
  let dafiMarketplace: DAFIMarketplace;
  
  let owner: SignerWithAddress;
  let farmer: SignerWithAddress;
  let investor: SignerWithAddress;
  let verifier: SignerWithAddress;

  const farmAsset = {
    location: "California, USA",
    size: 10000,
    assetType: "Organic Farm",
    valuation: ethers.utils.parseEther("100000"),
    metadataURI: "ipfs://QmTest",
    shares: 1000,
    pricePerShare: ethers.utils.parseEther("100")
  };

  beforeEach(async function () {
    [owner, farmer, investor, verifier] = await ethers.getSigners();

    // Deploy contracts
    const DAFIToken = await ethers.getContractFactory("DAFIToken");
    dafiToken = await DAFIToken.deploy();
    await dafiToken.deployed();

    const FarmAssetToken = await ethers.getContractFactory("FarmAssetToken");
    farmAssetToken = await FarmAssetToken.deploy();
    await farmAssetToken.deployed();

    const DAFIVault = await ethers.getContractFactory("DAFIVault");
    dafiVault = await DAFIVault.deploy(dafiToken.address);
    await dafiVault.deployed();

    const DAFIMarketplace = await ethers.getContractFactory("DAFIMarketplace");
    dafiMarketplace = await DAFIMarketplace.deploy(dafiToken.address, farmAssetToken.address);
    await dafiMarketplace.deployed();

    // Setup roles
    await farmAssetToken.addVerifier(verifier.address);
    
    // Mint tokens for testing
    await dafiToken.mint(investor.address, ethers.utils.parseEther("1000000"));
    await dafiToken.connect(investor).approve(dafiVault.address, ethers.constants.MaxUint256);
    await dafiToken.connect(investor).approve(dafiMarketplace.address, ethers.constants.MaxUint256);
  });

  describe("Complete Investment Flow", function () {
    it("Should complete full investment cycle", async function () {
      // 1. Create Farm Asset
      await expect(
        farmAssetToken.connect(farmer).mintAsset(
          farmer.address,
          farmAsset.location,
          farmAsset.size,
          farmAsset.assetType,
          farmAsset.valuation,
          farmAsset.metadataURI
        )
      ).to.emit(farmAssetToken, "AssetMinted");

      const tokenId = 1;

      // 2. Verify Asset
      await expect(
        farmAssetToken.connect(verifier).verifyAsset(tokenId)
      ).to.emit(farmAssetToken, "AssetVerified");

      // 3. Create Investment Opportunity
      await dafiVault.createAsset(farmAsset.shares, farmAsset.pricePerShare);
      const assetId = 1;

      // 4. Make Investment
      const investmentShares = 100;
      await expect(
        dafiVault.connect(investor).invest(assetId, investmentShares)
      ).to.emit(dafiVault, "InvestmentMade");

      // 5. List Shares on Marketplace
      await farmAssetToken.connect(farmer).approve(dafiMarketplace.address, tokenId);
      const listingPrice = ethers.utils.parseEther("150"); // 50% premium
      await expect(
        dafiMarketplace.connect(farmer).listAsset(tokenId, listingPrice)
      ).to.emit(dafiMarketplace, "AssetListed");

      // 6. Secondary Market Purchase
      await expect(
        dafiMarketplace.connect(investor).buyAsset(tokenId)
      ).to.emit(dafiMarketplace, "AssetSold");

      // 7. Distribute Returns
      const returnAmount = ethers.utils.parseEther("10000");
      await dafiToken.mint(owner.address, returnAmount);
      await dafiToken.approve(dafiVault.address, returnAmount);
      await expect(
        dafiVault.distributeReturns(assetId, returnAmount)
      ).to.emit(dafiVault, "ReturnsDistributed");

      // 8. Withdraw Returns
      await expect(
        dafiVault.connect(investor).withdrawReturns(assetId)
      ).to.emit(dafiVault, "ReturnsWithdrawn");

      // 9. Verify Final State
      const investment = await dafiVault.getInvestmentDetails(investor.address, assetId);
      expect(investment.shares).to.equal(investmentShares);
      expect(await farmAssetToken.ownerOf(tokenId)).to.equal(investor.address);
    });
  });

  describe("Error Handling", function () {
    it("Should handle invalid investment amount", async function () {
      await farmAssetToken.connect(farmer).mintAsset(
        farmer.address,
        farmAsset.location,
        farmAsset.size,
        farmAsset.assetType,
        farmAsset.valuation,
        farmAsset.metadataURI
      );

      await dafiVault.createAsset(farmAsset.shares, farmAsset.pricePerShare);

      // Try to invest more shares than available
      await expect(
        dafiVault.connect(investor).invest(1, farmAsset.shares + 1)
      ).to.be.revertedWith("Insufficient available shares");
    });

    it("Should handle unauthorized operations", async function () {
      // Try to verify asset without permission
      await farmAssetToken.connect(farmer).mintAsset(
        farmer.address,
        farmAsset.location,
        farmAsset.size,
        farmAsset.assetType,
        farmAsset.valuation,
        farmAsset.metadataURI
      );

      await expect(
        farmAssetToken.connect(investor).verifyAsset(1)
      ).to.be.revertedWith("Only verifiers can verify assets");
    });
  });

  describe("Market Conditions", function () {
    it("Should handle market price changes", async function () {
      // Create and verify asset
      await farmAssetToken.connect(farmer).mintAsset(
        farmer.address,
        farmAsset.location,
        farmAsset.size,
        farmAsset.assetType,
        farmAsset.valuation,
        farmAsset.metadataURI
      );
      await farmAssetToken.connect(verifier).verifyAsset(1);

      // List on marketplace
      await farmAssetToken.connect(farmer).approve(dafiMarketplace.address, 1);
      await dafiMarketplace.connect(farmer).listAsset(1, farmAsset.pricePerShare);

      // Update price
      const newPrice = ethers.utils.parseEther("120"); // 20% increase
      await expect(
        dafiMarketplace.connect(farmer).updatePrice(1, newPrice)
      ).to.emit(dafiMarketplace, "PriceUpdated");

      // Verify new price
      const listing = await dafiMarketplace.getListing(1);
      expect(listing.price).to.equal(newPrice);
    });
  });
});
