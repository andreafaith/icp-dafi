import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

export interface WalletConnection {
  principal: Principal;
  accountId: string;
  provider: string;
}

class WalletService {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;

  async initialize(): Promise<void> {
    this.authClient = await AuthClient.create();
    this.agent = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app',
    });

    if (process.env.NODE_ENV !== 'production') {
      this.agent.fetchRootKey().catch(console.error);
    }
  }

  async connectPlug(): Promise<WalletConnection | null> {
    try {
      // @ts-ignore - Plug types are not available
      const connected = await window.ic?.plug?.requestConnect({
        whitelist: [], // Add your canister IDs here
        host: process.env.NEXT_PUBLIC_IC_HOST,
      });

      if (!connected) return null;

      // @ts-ignore
      const principal = await window.ic?.plug?.agent?.getPrincipal();
      // @ts-ignore
      const accountId = await window.ic?.plug?.accountId;

      return {
        principal,
        accountId,
        provider: 'plug',
      };
    } catch (error) {
      console.error('Error connecting to Plug wallet:', error);
      return null;
    }
  }

  async connectStoic(): Promise<WalletConnection | null> {
    try {
      if (!this.authClient) {
        await this.initialize();
      }

      const identity = await this.authClient?.login({
        identityProvider: process.env.NEXT_PUBLIC_STOIC_PROVIDER,
        onSuccess: () => {},
      });

      if (!identity) return null;

      const principal = identity.getPrincipal();
      return {
        principal,
        accountId: principal.toText(), // You might want to derive the actual account ID
        provider: 'stoic',
      };
    } catch (error) {
      console.error('Error connecting to Stoic wallet:', error);
      return null;
    }
  }

  async connectInfinity(): Promise<WalletConnection | null> {
    try {
      // @ts-ignore - Infinity types are not available
      const connected = await window.ic?.infinityWallet?.requestConnect({
        whitelist: [], // Add your canister IDs here
        host: process.env.NEXT_PUBLIC_IC_HOST,
      });

      if (!connected) return null;

      // @ts-ignore
      const principal = await window.ic?.infinityWallet?.getPrincipal();
      return {
        principal,
        accountId: principal.toText(), // You might want to derive the actual account ID
        provider: 'infinity',
      };
    } catch (error) {
      console.error('Error connecting to Infinity wallet:', error);
      return null;
    }
  }

  async connect(provider: string): Promise<WalletConnection | null> {
    switch (provider) {
      case 'plug':
        return this.connectPlug();
      case 'stoic':
        return this.connectStoic();
      case 'infinity':
        return this.connectInfinity();
      default:
        throw new Error(`Unsupported wallet provider: ${provider}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
    }
    // Add other wallet-specific disconnect logic here
  }

  async signMessage(message: string): Promise<string | null> {
    try {
      // @ts-ignore - Wallet types are not available
      if (window.ic?.plug) {
        // @ts-ignore
        return await window.ic.plug.signMessage(message);
      }
      // Add other wallet-specific signing logic here
      return null;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }

  async getBalance(): Promise<bigint | null> {
    try {
      // @ts-ignore - Wallet types are not available
      if (window.ic?.plug) {
        // @ts-ignore
        return await window.ic.plug.requestBalance();
      }
      // Add other wallet-specific balance logic here
      return null;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }

  createActor<T>(canisterId: string, idlFactory: any): Actor | null {
    try {
      if (!this.agent) return null;
      return Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId,
      });
    } catch (error) {
      console.error('Error creating actor:', error);
      return null;
    }
  }
}

export const walletService = new WalletService();
