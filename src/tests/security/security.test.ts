import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as assetsIdl } from '../../declarations/dafi_assets';
import { idlFactory as backendIdl } from '../../declarations/dafi_backend';
import { AnonymousIdentity } from '@dfinity/agent';

describe('Security Tests', () => {
  let agent: HttpAgent;
  let assetsActor: any;
  let backendActor: any;
  let anonymousAgent: HttpAgent;
  let anonymousAssetsActor: any;
  let anonymousBackendActor: any;

  beforeAll(async () => {
    // Initialize authenticated agent
    agent = new HttpAgent({
      host: 'http://localhost:8000',
    });
    await agent.fetchRootKey();

    // Initialize anonymous agent
    anonymousAgent = new HttpAgent({
      host: 'http://localhost:8000',
      identity: new AnonymousIdentity(),
    });
    await anonymousAgent.fetchRootKey();

    // Create actors
    assetsActor = Actor.createActor(assetsIdl, {
      agent,
      canisterId: process.env.ASSETS_CANISTER_ID!,
    });

    backendActor = Actor.createActor(backendIdl, {
      agent,
      canisterId: process.env.BACKEND_CANISTER_ID!,
    });

    anonymousAssetsActor = Actor.createActor(assetsIdl, {
      agent: anonymousAgent,
      canisterId: process.env.ASSETS_CANISTER_ID!,
    });

    anonymousBackendActor = Actor.createActor(backendIdl, {
      agent: anonymousAgent,
      canisterId: process.env.BACKEND_CANISTER_ID!,
    });
  });

  describe('Authentication Tests', () => {
    it('should reject anonymous asset creation', async () => {
      const result = await anonymousBackendActor.createAsset({
        name: 'Test Asset',
        assetType: 'farm',
        location: { latitude: 0, longitude: 0 },
        value: 100000n,
      }).catch(e => e);

      expect(result).toMatch(/unauthorized/i);
    });

    it('should reject unauthorized token transfers', async () => {
      const unauthorized = Principal.fromText('bbbbb-bb');
      const result = await anonymousAssetsActor.transferToken(0n, unauthorized)
        .catch(e => e);

      expect(result).toMatch(/unauthorized/i);
    });

    it('should validate user roles', async () => {
      const result = await anonymousBackendActor.setAdminRole(
        Principal.fromText('aaaaa-aa')
      ).catch(e => e);

      expect(result).toMatch(/unauthorized/i);
    });
  });

  describe('Input Validation Tests', () => {
    it('should reject invalid asset data', async () => {
      const result = await backendActor.createAsset({
        name: '', // Invalid empty name
        assetType: 'invalid_type',
        location: { latitude: -100, longitude: 200 }, // Invalid coordinates
        value: -1n, // Invalid negative value
      }).catch(e => e);

      expect(result).toMatch(/validation error/i);
    });

    it('should sanitize input data', async () => {
      const result = await backendActor.createAsset({
        name: '<script>alert("xss")</script>',
        assetType: 'farm',
        location: { latitude: 0, longitude: 0 },
        value: 100000n,
      });

      expect(result.ok).toBeDefined();
      const asset = await backendActor.getAsset(result.ok);
      expect(asset.name).not.toMatch(/<script>/i);
    });

    it('should validate investment amounts', async () => {
      const result = await backendActor.invest('asset-1', -1000n)
        .catch(e => e);

      expect(result).toMatch(/invalid amount/i);
    });
  });

  describe('Access Control Tests', () => {
    let assetId: string;

    beforeAll(async () => {
      const result = await backendActor.createAsset({
        name: 'Access Control Test Asset',
        assetType: 'farm',
        location: { latitude: 0, longitude: 0 },
        value: 100000n,
      });
      assetId = result.ok;
    });

    it('should enforce owner-only operations', async () => {
      const result = await anonymousBackendActor.updateAsset(assetId, {
        name: 'Hacked Asset',
      }).catch(e => e);

      expect(result).toMatch(/unauthorized/i);
    });

    it('should prevent unauthorized role assignments', async () => {
      const result = await anonymousBackendActor.setAdminRole(
        Principal.fromText('aaaaa-aa')
      ).catch(e => e);

      expect(result).toMatch(/unauthorized/i);
    });

    it('should validate token ownership for transfers', async () => {
      const result = await anonymousAssetsActor.transferToken(
        0n,
        Principal.fromText('aaaaa-aa')
      ).catch(e => e);

      expect(result).toMatch(/unauthorized/i);
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should limit rapid requests', async () => {
      const requests = Array(100).fill(null).map(() => 
        backendActor.getAsset('asset-1')
      );

      const results = await Promise.all(requests);
      const errors = results.filter(r => r.err);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].err).toMatch(/rate limit/i);
    });
  });

  describe('Data Integrity Tests', () => {
    it('should prevent data tampering', async () => {
      // Create an asset
      const createResult = await backendActor.createAsset({
        name: 'Integrity Test Asset',
        assetType: 'farm',
        location: { latitude: 0, longitude: 0 },
        value: 100000n,
      });
      const assetId = createResult.ok;

      // Try to modify with anonymous actor
      const updateResult = await anonymousBackendActor.updateAsset(
        assetId,
        { value: 0n }
      ).catch(e => e);

      expect(updateResult).toMatch(/unauthorized/i);

      // Verify data hasn't changed
      const asset = await backendActor.getAsset(assetId);
      expect(asset.value).toBe(100000n);
    });

    it('should maintain transaction integrity', async () => {
      const investResult = await backendActor.invest('asset-1', 1000n);
      expect(investResult.ok).toBeDefined();

      // Verify investment was recorded correctly
      const investment = await backendActor.getInvestment('asset-1');
      expect(investment.amount).toBe(1000n);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle invalid canister calls gracefully', async () => {
      const result = await backendActor.nonExistentMethod()
        .catch(e => e);

      expect(result).toMatch(/method not found/i);
    });

    it('should handle network errors gracefully', async () => {
      // Simulate network error by using invalid canister ID
      const invalidActor = Actor.createActor(backendIdl, {
        agent,
        canisterId: Principal.fromText('aaaaa-aa'),
      });

      const result = await invalidActor.getAsset('asset-1')
        .catch(e => e);

      expect(result).toMatch(/network error/i);
    });
  });
});
