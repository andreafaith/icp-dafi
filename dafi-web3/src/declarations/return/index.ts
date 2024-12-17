import { Actor, HttpAgent } from '@dfinity/agent';

// Imports and re-exports candid interface
import { idlFactory } from './return.did';
import type { _SERVICE } from './return.did';

export { idlFactory, _SERVICE };

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
export const canisterId = process.env.NEXT_PUBLIC_RETURN_CANISTER_ID as string;

export const createActor = (canisterId: string, options: {
  agentOptions?: { host: string };
} = {}) => {
  const defaultOptions = {
    host: process.env.NEXT_PUBLIC_IC_HOST || "http://localhost:4943",
  };

  const agent = new HttpAgent({ 
    ...defaultOptions,
    ...options?.agentOptions
  });

  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch(err => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
