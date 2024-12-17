import { Principal } from '@dfinity/principal';

declare global {
  interface Window {
    ic: {
      plug: {
        requestConnect: () => Promise<boolean>;
        getPrincipal: () => Promise<Principal>;
        getBalance: () => Promise<bigint>;
        signMessage: () => Promise<string>;
        disconnect: () => Promise<void>;
        isConnected: () => Promise<boolean>;
      };
    };
  }
}
