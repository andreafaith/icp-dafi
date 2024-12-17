import { DIDAuthResponse } from './types';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import KeyDidResolver from 'key-did-resolver';
import { randomBytes } from 'crypto';

export class DIDAuthService {
  private did: DID;

  constructor() {
    const resolver = KeyDidResolver.getResolver();
    this.did = new DID({ resolver });
  }

  async initialize(seed: Uint8Array) {
    const provider = new Ed25519Provider(seed);
    this.did.setProvider(provider);
    await this.did.authenticate();
  }

  async createDID(): Promise<string> {
    const seed = randomBytes(32);
    await this.initialize(seed);
    return this.did.id;
  }

  async verifyCredential(verifiableCredential: string): Promise<boolean> {
    try {
      const verified = await this.did.verifyJWS(verifiableCredential);
      return !!verified;
    } catch (error) {
      console.error('DID credential verification failed:', error);
      return false;
    }
  }

  async authenticateDID(response: DIDAuthResponse): Promise<boolean> {
    const { did: didId, verifiableCredential, proof } = response;

    // Verify DID exists
    if (!didId) {
      throw new Error('DID not provided');
    }

    // Verify credential
    const isValidCredential = await this.verifyCredential(verifiableCredential);
    if (!isValidCredential) {
      throw new Error('Invalid verifiable credential');
    }

    // Verify proof
    try {
      const verified = await this.did.verifyJWS(proof);
      return !!verified;
    } catch (error) {
      throw new Error('Invalid DID proof');
    }
  }

  async createVerifiableCredential(
    did: string,
    claims: Record<string, any>
  ): Promise<string> {
    const jws = await this.did.createJWS({
      did,
      ...claims,
      issuedAt: new Date().toISOString(),
    });
    return jws.signatures[0].signature;
  }
}
