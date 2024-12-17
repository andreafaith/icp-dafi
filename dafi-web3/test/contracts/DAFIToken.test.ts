import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DAFIToken } from "../../typechain";

describe("DAFIToken", function () {
  let dafiToken: DAFIToken;
  let owner: SignerWithAddress;
  let validator: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, validator, user] = await ethers.getSigners();

    const DAFIToken = await ethers.getContractFactory("DAFIToken");
    dafiToken = await DAFIToken.deploy();
    await dafiToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await dafiToken.owner()).to.equal(owner.address);
    });

    it("Should set deployer as validator", async function () {
      expect(await dafiToken.isValidator(owner.address)).to.equal(true);
    });
  });

  describe("Validator Management", function () {
    it("Should allow owner to add validator", async function () {
      await dafiToken.addValidator(validator.address);
      expect(await dafiToken.isValidator(validator.address)).to.equal(true);
    });

    it("Should allow owner to remove validator", async function () {
      await dafiToken.addValidator(validator.address);
      await dafiToken.removeValidator(validator.address);
      expect(await dafiToken.isValidator(validator.address)).to.equal(false);
    });

    it("Should not allow non-owner to add validator", async function () {
      await expect(
        dafiToken.connect(user).addValidator(validator.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token Operations", function () {
    it("Should allow validator to mint tokens", async function () {
      const amount = ethers.utils.parseEther("1000");
      await dafiToken.mint(user.address, amount);
      expect(await dafiToken.balanceOf(user.address)).to.equal(amount);
    });

    it("Should not allow non-validator to mint tokens", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        dafiToken.connect(user).mint(user.address, amount)
      ).to.be.revertedWith("Only validators can mint");
    });

    it("Should allow users to burn their tokens", async function () {
      const amount = ethers.utils.parseEther("1000");
      await dafiToken.mint(user.address, amount);
      await dafiToken.connect(user).burn(amount);
      expect(await dafiToken.balanceOf(user.address)).to.equal(0);
    });

    it("Should not exceed max supply", async function () {
      const maxSupply = ethers.utils.parseEther("1000000000"); // 1 billion
      await expect(
        dafiToken.mint(user.address, maxSupply.add(1))
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause token", async function () {
      await dafiToken.pause();
      expect(await dafiToken.paused()).to.equal(true);
    });

    it("Should not allow transfers when paused", async function () {
      const amount = ethers.utils.parseEther("1000");
      await dafiToken.mint(user.address, amount);
      await dafiToken.pause();
      await expect(
        dafiToken.connect(user).transfer(validator.address, amount)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow transfers after unpause", async function () {
      const amount = ethers.utils.parseEther("1000");
      await dafiToken.mint(user.address, amount);
      await dafiToken.pause();
      await dafiToken.unpause();
      await dafiToken.connect(user).transfer(validator.address, amount);
      expect(await dafiToken.balanceOf(validator.address)).to.equal(amount);
    });
  });

  describe("Events", function () {
    it("Should emit Transfer event on mint", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(dafiToken.mint(user.address, amount))
        .to.emit(dafiToken, "Transfer")
        .withArgs(ethers.constants.AddressZero, user.address, amount);
    });

    it("Should emit Transfer event on burn", async function () {
      const amount = ethers.utils.parseEther("1000");
      await dafiToken.mint(user.address, amount);
      await expect(dafiToken.connect(user).burn(amount))
        .to.emit(dafiToken, "Transfer")
        .withArgs(user.address, ethers.constants.AddressZero, amount);
    });
  });
});
