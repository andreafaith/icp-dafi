import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { FarmAssetToken } from "../../typechain";

describe("FarmAssetToken", function () {
  let farmAssetToken: FarmAssetToken;
  let owner: SignerWithAddress;
  let verifier: SignerWithAddress;
  let farmer: SignerWithAddress;

  const testAsset = {
    location: "California, USA",
    size: 10000, // 1 hectare in square meters
    assetType: "Farm",
    valuation: ethers.utils.parseEther("100000"),
    metadataURI: "ipfs://QmTest",
  };

  beforeEach(async function () {
    [owner, verifier, farmer] = await ethers.getSigners();

    const FarmAssetToken = await ethers.getContractFactory("FarmAssetToken");
    farmAssetToken = await FarmAssetToken.deploy();
    await farmAssetToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await farmAssetToken.owner()).to.equal(owner.address);
    });

    it("Should set deployer as verifier", async function () {
      expect(await farmAssetToken.isVerifier(owner.address)).to.equal(true);
    });
  });

  describe("Verifier Management", function () {
    it("Should allow owner to add verifier", async function () {
      await farmAssetToken.addVerifier(verifier.address);
      expect(await farmAssetToken.isVerifier(verifier.address)).to.equal(true);
    });

    it("Should allow owner to remove verifier", async function () {
      await farmAssetToken.addVerifier(verifier.address);
      await farmAssetToken.removeVerifier(verifier.address);
      expect(await farmAssetToken.isVerifier(verifier.address)).to.equal(false);
    });

    it("Should not allow non-owner to add verifier", async function () {
      await expect(
        farmAssetToken.connect(farmer).addVerifier(verifier.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Asset Management", function () {
    it("Should mint new asset", async function () {
      await expect(
        farmAssetToken.mintAsset(
          farmer.address,
          testAsset.location,
          testAsset.size,
          testAsset.assetType,
          testAsset.valuation,
          testAsset.metadataURI
        )
      )
        .to.emit(farmAssetToken, "AssetMinted")
        .withArgs(1, farmer.address, testAsset.assetType);
    });

    it("Should get asset details", async function () {
      await farmAssetToken.mintAsset(
        farmer.address,
        testAsset.location,
        testAsset.size,
        testAsset.assetType,
        testAsset.valuation,
        testAsset.metadataURI
      );

      const asset = await farmAssetToken.getAsset(1);
      expect(asset.location).to.equal(testAsset.location);
      expect(asset.size).to.equal(testAsset.size);
      expect(asset.assetType).to.equal(testAsset.assetType);
      expect(asset.valuation).to.equal(testAsset.valuation);
      expect(asset.metadataURI).to.equal(testAsset.metadataURI);
      expect(asset.isVerified).to.equal(false);
    });

    it("Should verify asset", async function () {
      await farmAssetToken.mintAsset(
        farmer.address,
        testAsset.location,
        testAsset.size,
        testAsset.assetType,
        testAsset.valuation,
        testAsset.metadataURI
      );

      await expect(farmAssetToken.verifyAsset(1))
        .to.emit(farmAssetToken, "AssetVerified")
        .withArgs(1, owner.address);

      const asset = await farmAssetToken.getAsset(1);
      expect(asset.isVerified).to.equal(true);
    });

    it("Should not allow non-verifier to verify asset", async function () {
      await farmAssetToken.mintAsset(
        farmer.address,
        testAsset.location,
        testAsset.size,
        testAsset.assetType,
        testAsset.valuation,
        testAsset.metadataURI
      );

      await expect(
        farmAssetToken.connect(farmer).verifyAsset(1)
      ).to.be.revertedWith("Only verifiers can verify assets");
    });
  });

  describe("Asset Updates", function () {
    beforeEach(async function () {
      await farmAssetToken.mintAsset(
        farmer.address,
        testAsset.location,
        testAsset.size,
        testAsset.assetType,
        testAsset.valuation,
        testAsset.metadataURI
      );
    });

    it("Should update asset valuation by owner", async function () {
      const newValuation = ethers.utils.parseEther("150000");
      await expect(farmAssetToken.updateValuation(1, newValuation))
        .to.emit(farmAssetToken, "AssetUpdated")
        .withArgs(1, newValuation);

      const asset = await farmAssetToken.getAsset(1);
      expect(asset.valuation).to.equal(newValuation);
    });

    it("Should update asset valuation by verifier", async function () {
      await farmAssetToken.addVerifier(verifier.address);
      const newValuation = ethers.utils.parseEther("150000");
      await expect(farmAssetToken.connect(verifier).updateValuation(1, newValuation))
        .to.emit(farmAssetToken, "AssetUpdated")
        .withArgs(1, newValuation);
    });

    it("Should not allow unauthorized valuation update", async function () {
      const newValuation = ethers.utils.parseEther("150000");
      await expect(
        farmAssetToken.connect(farmer).updateValuation(1, newValuation)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      await farmAssetToken.mintAsset(
        farmer.address,
        testAsset.location,
        testAsset.size,
        testAsset.assetType,
        testAsset.valuation,
        testAsset.metadataURI
      );

      expect(await farmAssetToken.tokenURI(1)).to.equal(testAsset.metadataURI);
    });

    it("Should revert for non-existent token", async function () {
      await expect(farmAssetToken.tokenURI(99)).to.be.revertedWith(
        "Asset does not exist"
      );
    });
  });
});
