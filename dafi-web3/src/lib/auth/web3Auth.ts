import { ethers } from 'ethers';
import { Web3AuthResponse, AuthChallenge } from './types';

export class Web3AuthService {
  private readonly CHALLENGE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  async generateChallenge(address: string): Promise<AuthChallenge> {
    const challenge = `Welcome to DAFI Platform!

Please sign this message to verify your wallet ownership.
This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address: ${address}
Timestamp: ${new Date().toISOString()}
Nonce: ${ethers.utils.randomBytes(32).toString('hex')}`;

    return {
      challenge,
      expiresAt: new Date(Date.now() + this.CHALLENGE_EXPIRY),
    };
  }

  async verifySignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  async validateChainId(chainId: number): Promise<boolean> {
    // Add supported chain IDs (e.g., Ethereum mainnet, Polygon)
    const supportedChainIds = [1, 137, 80001];
    return supportedChainIds.includes(chainId);
  }

  async authenticateWeb3(response: Web3AuthResponse): Promise<boolean> {
    const { signature, address, chainId, message } = response;

    // Validate chain ID
    if (!(await this.validateChainId(chainId))) {
      throw new Error('Unsupported blockchain network');
    }

    // Verify signature
    const isValid = await this.verifySignature(message, signature, address);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    return true;
  }
}
