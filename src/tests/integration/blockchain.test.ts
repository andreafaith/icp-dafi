import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as assetsIdl } from '../../declarations/dafi_assets';
import { idlFactory as backendIdl } from '../../declarations/dafi_backend';
import { AssetService } from '../../lib/services/AssetService';
import { mockAsset, mockMetrics } from '../mocks/assetMocks';

describe('Blockchain Integration Tests', () => {
  let agent: HttpAgent;
  let assetsActor: any;
  let backendActor: any;
  let assetService: AssetService;

  beforeAll(async () => {
    // Initialize local canister
    agent = new HttpAgent({
      host: 'http://localhost:8000',
    });

    // Only in local development
    await agent.fetchRootKey();

    // Create actors
    assetsActor = Actor.createActor(assetsIdl, {
      agent,
      canisterId: process.env.ASSETS_CANISTER_ID!,
    });

    backendActor = Actor.createActor(backendIdl, {
      agent,
      canisterId: process.env.BACKEND_CANISTER_ID!,
    });

    assetService = new AssetService(agent);
  });

  describe('Asset Creation and Management', () => {
    let assetId: string;
    let tokenId: bigint;

    it('should create a new asset', async () => {
      const result = await backendActor.createAsset({
        name: mockAsset.name,
        assetType: mockAsset.type,
        location: mockAsset.location,
        value: mockAsset.value,
      });

      expect(result.ok).toBeDefined();
      assetId = result.ok;
      expect(typeof assetId).toBe('string');
    });

    it('should mint a token for the asset', async () => {
      const result = await assetsActor.mintToken(assetId, 100n);
      expect(result.ok).toBeDefined();
      tokenId = result.ok;
      expect(typeof tokenId).toBe('bigint');
    });

    it('should update asset metrics', async () => {
      const result = await assetsActor.updateMetrics(assetId, mockMetrics);
      expect(result.ok).toBeDefined();
    });

    it('should retrieve asset details', async () => {
      const asset = await backendActor.getAsset(assetId);
      expect(asset).toBeDefined();
      expect(asset.name).toBe(mockAsset.name);
      expect(asset.type).toBe(mockAsset.type);
    });

    it('should transfer asset token', async () => {
      const recipient = Principal.fromText('aaaaa-aa');
      const result = await assetsActor.transferToken(tokenId, recipient);
      expect(result.ok).toBeDefined();
    });
  });

  describe('Investment Flow', () => {
    let investorId: Principal;
    let assetId: string;

    beforeAll(async () => {
      investorId = Principal.fromText('aaaaa-aa');
      const result = await backendActor.createAsset({
        name: 'Investment Test Asset',
        assetType: 'farm',
        location: { latitude: 0, longitude: 0 },
        value: 100000n,
      });
      assetId = result.ok;
    });

    it('should allow investment in asset', async () => {
      const result = await backendActor.invest(assetId);
      expect(result.ok).toBeDefined();
    });

    it('should track investment amount', async () => {
      const investment = await backendActor.getInvestment(assetId, investorId);
      expect(investment).toBeDefined();
      expect(investment.amount).toBeGreaterThan(0n);
    });

    it('should distribute returns', async () => {
      const result = await backendActor.distributeReturns(assetId);
      expect(result.ok).toBeDefined();

      const investment = await backendActor.getInvestment(assetId, investorId);
      expect(investment.returns).toBeGreaterThan(0n);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid asset creation', async () => {
      const result = await backendActor.createAsset({
        name: '', // Invalid name
        assetType: 'invalid',
        location: { latitude: 0, longitude: 0 },
        value: 0n,
      });

      expect(result.err).toBeDefined();
      expect(result.err).toMatch(/validation error/i);
    });

    it('should handle unauthorized token transfer', async () => {
      const unauthorized = Principal.fromText('bbbbb-bb');
      const result = await assetsActor.transferToken(0n, unauthorized);
      expect(result.err).toBeDefined();
      expect(result.err).toMatch(/unauthorized/i);
    });

    it('should handle invalid investment amount', async () => {
      const result = await backendActor.invest('invalid-asset-id');
      expect(result.err).toBeDefined();
      expect(result.err).toMatch(/not found/i);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent transactions', async () => {
      const transactions = Array(10).fill(null).map(() => 
        backendActor.createAsset({
          name: 'Concurrent Test Asset',
          assetType: 'farm',
          location: { latitude: 0, longitude: 0 },
          value: 100000n,
        })
      );

      const results = await Promise.all(transactions);
      results.forEach(result => {
        expect(result.ok).toBeDefined();
      });
    });

    it('should maintain performance under load', async () => {
      const start = Date.now();
      
      const operations = Array(100).fill(null).map((_, i) => 
        backendActor.getAsset(`asset-${i}`)
      );

      await Promise.all(operations);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across canisters', async () => {
      // Create asset in backend
      const createResult = await backendActor.createAsset({
        name: 'Consistency Test Asset',
        assetType: 'farm',
        location: { latitude: 0, longitude: 0 },
        value: 100000n,
      });
      const assetId = createResult.ok;

      // Mint token in assets canister
      const mintResult = await assetsActor.mintToken(assetId, 100n);
      const tokenId = mintResult.ok;

      // Verify consistency
      const asset = await backendActor.getAsset(assetId);
      const token = await assetsActor.getToken(tokenId);

      expect(asset.id).toBe(assetId);
      expect(token.assetId).toBe(assetId);
    });
  });
});
