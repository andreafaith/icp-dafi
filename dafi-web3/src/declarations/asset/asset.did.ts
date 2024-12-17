import { Principal } from '@dfinity/principal';

export interface Asset {
  'owner': Principal;
  'metadata': {
    'name': string;
    'description': string;
    'location': string;
    'type': string;
  };
  'totalShares': bigint;
  'pricePerShare': bigint;
}

export interface _SERVICE {
  'tokenizeAsset': (asset: Asset) => Promise<{
    'status': string;
    'assetId': string;
  }>;
  'getAssetDetails': (assetId: string) => Promise<Asset | undefined>;
  'getAssetsByOwner': (owner: Principal) => Promise<Array<Asset>>;
}

export const idlFactory = ({ IDL }: { IDL: any }) => {
  const Asset = IDL.Record({
    'owner': IDL.Principal,
    'metadata': IDL.Record({
      'name': IDL.Text,
      'description': IDL.Text,
      'location': IDL.Text,
      'type': IDL.Text,
    }),
    'totalShares': IDL.Nat,
    'pricePerShare': IDL.Nat,
  });

  return IDL.Service({
    'tokenizeAsset': IDL.Func([Asset], [IDL.Record({
      'status': IDL.Text,
      'assetId': IDL.Text,
    })], []),
    'getAssetDetails': IDL.Func([IDL.Text], [IDL.Opt(Asset)], ['query']),
    'getAssetsByOwner': IDL.Func([IDL.Principal], [IDL.Vec(Asset)], ['query']),
  });
};

export const init = () => { return []; };
