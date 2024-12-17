import { Principal } from '@dfinity/principal';

export interface Investment {
  'investor': Principal;
  'assetId': string;
  'shares': bigint;
  'amount': bigint;
  'status': string;
}

export interface _SERVICE {
  'invest': (assetId: string, amount: bigint) => Promise<{
    'status': string;
    'investmentId': string;
  }>;
  'getInvestmentsByInvestor': (investor: Principal) => Promise<Array<Investment>>;
  'getInvestmentsByAsset': (assetId: string) => Promise<Array<Investment>>;
  'getInvestment': (id: string) => Promise<Investment | undefined>;
  'updateInvestment': (id: string, investment: Investment) => Promise<Investment>;
  'cancelInvestment': (id: string) => Promise<void>;
}

export const idlFactory = ({ IDL }: { IDL: any }) => {
  const Investment = IDL.Record({
    'investor': IDL.Principal,
    'assetId': IDL.Text,
    'shares': IDL.Nat,
    'amount': IDL.Nat,
    'status': IDL.Text,
  });

  return IDL.Service({
    'invest': IDL.Func([IDL.Text, IDL.Nat], [IDL.Record({
      'status': IDL.Text,
      'investmentId': IDL.Text,
    })], []),
    'getInvestmentsByInvestor': IDL.Func([IDL.Principal], [IDL.Vec(Investment)], ['query']),
    'getInvestmentsByAsset': IDL.Func([IDL.Text], [IDL.Vec(Investment)], ['query']),
    'getInvestment': IDL.Func([IDL.Text], [IDL.Opt(Investment)], ['query']),
    'updateInvestment': IDL.Func([IDL.Text, Investment], [Investment], []),
    'cancelInvestment': IDL.Func([IDL.Text], [], []),
  });
};

export const init = () => { return []; };
