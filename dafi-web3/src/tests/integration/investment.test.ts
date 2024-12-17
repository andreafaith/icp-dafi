import { Principal } from '@dfinity/principal';
import { ContractService } from '@/services/ContractService';

describe('Investment Flow Integration', () => {
  let contractService: ContractService;
  const mockIdentity = {};
  const mockInvestorId = Principal.fromText('2vxsx-fae');
  let assetId: string;

  beforeEach(() => {
    contractService = new ContractService(mockIdentity);

    // Mock the actors
    // @ts-ignore - Mock implementation
    contractService.assetActor = {
      tokenizeAsset: jest.fn().mockResolvedValue({
        status: 'success',
        assetId: '123',
      }),
      getAssetDetails: jest.fn().mockResolvedValue({
        owner: mockInvestorId,
        metadata: {
          name: 'Test Farm',
          description: 'A test agricultural asset',
          location: 'Test Location',
          type: 'Farm',
        },
        totalShares: BigInt(1000),
        pricePerShare: BigInt(100),
      }),
    };

    // @ts-ignore - Mock implementation
    contractService.investmentActor = {
      invest: jest.fn().mockResolvedValue({
        status: 'success',
        investmentId: '456',
      }),
      getInvestmentsByAsset: jest.fn().mockResolvedValue([{
        investor: mockInvestorId,
        assetId: '123',
        amount: BigInt(500),
        timestamp: BigInt(Date.now()),
      }]),
    };

    // @ts-ignore - Mock implementation
    contractService.returnActor = {
      createReturn: jest.fn().mockResolvedValue({
        status: 'success',
        returnId: '789',
      }),
      getReturnsByAsset: jest.fn().mockResolvedValue([{
        id: '789',
        assetId: '123',
        amount: BigInt(1000),
        distributionDate: BigInt(Date.now()),
        status: 'pending',
      }]),
    };
  });

  describe('Asset Tokenization and Investment', () => {
    it('should successfully tokenize an asset and create an investment', async () => {
      // Create asset
      const assetData = {
        owner: mockInvestorId,
        metadata: {
          name: 'Test Farm',
          description: 'A test agricultural asset',
          location: 'Test Location',
          type: 'Farm',
        },
        totalShares: BigInt(1000),
        pricePerShare: BigInt(100),
      };

      const result = await contractService.tokenizeAsset(assetData);
      expect(result).toBeDefined();
      expect(result.status).toBe('success');
      assetId = result.assetId;

      // Verify asset was created
      const assetDetails = await contractService.getAssetDetails(assetId);
      expect(assetDetails).toBeDefined();
      if (assetDetails) {
        expect(assetDetails.metadata.name).toBe(assetData.metadata.name);
      }

      // Create investment
      const investAmount = BigInt(500);
      const investResult = await contractService.invest(assetId, investAmount);
      expect(investResult).toBeDefined();
      expect(investResult.status).toBe('success');

      // Verify investment
      const investments = await contractService.getInvestmentsByAsset(assetId);
      expect(investments).toBeDefined();
      expect(investments.length).toBeGreaterThan(0);
      expect(investments[0].amount).toBe(investAmount);
    });

    it('should successfully distribute returns', async () => {
      const returnAmount = BigInt(1000);
      const distributionDate = BigInt(Date.now());

      const returnResult = await contractService.createReturn({
        assetId,
        amount: returnAmount,
        distributionDate,
      });

      expect(returnResult).toBeDefined();
      expect(returnResult.status).toBe('success');
      expect(returnResult.returnId).toBeDefined();

      // Verify returns
      const returns = await contractService.getReturnsByAsset(assetId);
      expect(returns).toBeDefined();
      expect(returns.length).toBeGreaterThan(0);
      expect(returns[0].amount).toBe(returnAmount);
    });
  });
});
