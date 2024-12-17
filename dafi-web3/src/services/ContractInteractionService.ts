import { ethers } from 'ethers';
import { 
  DAFIToken__factory,
  CropToken__factory,
  FarmAssetToken__factory,
  DAFIVault__factory,
  DAFILending__factory,
  DAFIMarketplace__factory,
  WeatherDerivatives__factory
} from '../typechain';

export class ContractInteractionService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private contracts: {
    dafiToken?: ethers.Contract;
    cropToken?: ethers.Contract;
    farmAssetToken?: ethers.Contract;
    dafiVault?: ethers.Contract;
    dafiLending?: ethers.Contract;
    dafiMarketplace?: ethers.Contract;
    weatherDerivatives?: ethers.Contract;
  };

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.contracts = {};
  }

  // Initialize contracts with addresses
  async initializeContracts(addresses: {
    dafiToken: string;
    cropToken: string;
    farmAssetToken: string;
    dafiVault: string;
    dafiLending: string;
    dafiMarketplace: string;
    weatherDerivatives: string;
  }) {
    this.contracts = {
      dafiToken: DAFIToken__factory.connect(addresses.dafiToken, this.signer),
      cropToken: CropToken__factory.connect(addresses.cropToken, this.signer),
      farmAssetToken: FarmAssetToken__factory.connect(addresses.farmAssetToken, this.signer),
      dafiVault: DAFIVault__factory.connect(addresses.dafiVault, this.signer),
      dafiLending: DAFILending__factory.connect(addresses.dafiLending, this.signer),
      dafiMarketplace: DAFIMarketplace__factory.connect(addresses.dafiMarketplace, this.signer),
      weatherDerivatives: WeatherDerivatives__factory.connect(addresses.weatherDerivatives, this.signer)
    };
  }

  // Token Operations
  async getDAFIBalance(address: string): Promise<string> {
    return this.contracts.dafiToken?.balanceOf(address);
  }

  async approveDafiToken(spender: string, amount: string): Promise<void> {
    const tx = await this.contracts.dafiToken?.approve(spender, amount);
    await tx.wait();
  }

  // Farm Asset Operations
  async createFarmAsset(
    location: string,
    size: number,
    assetType: string,
    valuation: string,
    metadataURI: string
  ): Promise<void> {
    const tx = await this.contracts.farmAssetToken?.mintAsset(
      await this.signer.getAddress(),
      location,
      size,
      assetType,
      valuation,
      metadataURI
    );
    await tx.wait();
  }

  async getFarmAsset(tokenId: number): Promise<any> {
    return this.contracts.farmAssetToken?.getAsset(tokenId);
  }

  // Investment Operations
  async createInvestment(assetId: number, amount: string): Promise<void> {
    const tx = await this.contracts.dafiVault?.invest(assetId, amount);
    await tx.wait();
  }

  async getInvestmentDetails(investor: string, assetId: number): Promise<any> {
    return this.contracts.dafiVault?.getInvestmentDetails(investor, assetId);
  }

  // Lending Operations
  async requestLoan(amount: string, duration: number): Promise<void> {
    const tx = await this.contracts.dafiLending?.requestLoan(amount, duration);
    await tx.wait();
  }

  async repayLoan(): Promise<void> {
    const tx = await this.contracts.dafiLending?.repayLoan();
    await tx.wait();
  }

  // Marketplace Operations
  async listAsset(tokenId: number, price: string): Promise<void> {
    const tx = await this.contracts.dafiMarketplace?.listAsset(tokenId, price);
    await tx.wait();
  }

  async buyAsset(tokenId: number): Promise<void> {
    const tx = await this.contracts.dafiMarketplace?.buyAsset(tokenId);
    await tx.wait();
  }

  // Weather Derivatives Operations
  async createWeatherContract(
    amount: string,
    strikeTemp: number,
    duration: number,
    premium: string,
    contractType: number
  ): Promise<void> {
    const tx = await this.contracts.weatherDerivatives?.createContract(
      amount,
      strikeTemp,
      duration,
      premium,
      contractType
    );
    await tx.wait();
  }

  async getWeatherContract(contractId: number): Promise<any> {
    return this.contracts.weatherDerivatives?.getContract(contractId);
  }

  // Event Listeners
  async subscribeToEvents(callback: (event: any) => void): Promise<void> {
    // Subscribe to relevant contract events
    this.contracts.dafiToken?.on('Transfer', callback);
    this.contracts.farmAssetToken?.on('AssetMinted', callback);
    this.contracts.dafiVault?.on('InvestmentMade', callback);
    this.contracts.dafiMarketplace?.on('AssetListed', callback);
    this.contracts.dafiMarketplace?.on('AssetSold', callback);
  }

  // Cleanup
  async cleanup(): Promise<void> {
    // Remove event listeners
    this.contracts.dafiToken?.removeAllListeners();
    this.contracts.farmAssetToken?.removeAllListeners();
    this.contracts.dafiVault?.removeAllListeners();
    this.contracts.dafiMarketplace?.removeAllListeners();
  }
}
