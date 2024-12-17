export interface Return {
  'id': string;
  'assetId': string;
  'amount': bigint;
  'distributionDate': bigint;
  'status': string;
}

export interface _SERVICE {
  'createReturn': (returnData: {
    assetId: string;
    amount: bigint;
    distributionDate: bigint;
  }) => Promise<{
    status: string;
    returnId: string;
  }>;
  'getReturnsByAsset': (assetId: string) => Promise<Array<Return>>;
}

export const idlFactory = ({ IDL }: { IDL: any }) => {
  const Return = IDL.Record({
    'id': IDL.Text,
    'assetId': IDL.Text,
    'amount': IDL.Nat,
    'distributionDate': IDL.Nat64,
    'status': IDL.Text,
  });

  const ReturnData = IDL.Record({
    'assetId': IDL.Text,
    'amount': IDL.Nat,
    'distributionDate': IDL.Nat64,
  });

  const ReturnResponse = IDL.Record({
    'status': IDL.Text,
    'returnId': IDL.Text,
  });

  return IDL.Service({
    'createReturn': IDL.Func([ReturnData], [ReturnResponse], []),
    'getReturnsByAsset': IDL.Func([IDL.Text], [IDL.Vec(Return)], ['query']),
  });
};

export const init = () => { return []; };
