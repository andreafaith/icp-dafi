export const idlFactory = ({ IDL }) => {
  const AssetStatus = IDL.Variant({
    'Available' : IDL.Null,
    'Sold' : IDL.Null,
    'Invested' : IDL.Null,
  });
  const FarmAsset = IDL.Record({
    'id' : IDL.Text,
    'status' : AssetStatus,
    'farmerId' : IDL.Principal,
    'size' : IDL.Float64,
    'valuation' : IDL.Nat,
    'assetType' : IDL.Text,
    'registrationDate' : IDL.Int,
    'location' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : FarmAsset, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'getAsset' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getAssetsByFarmer' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(FarmAsset)],
        ['query'],
      ),
    'getAvailableAssets' : IDL.Func([], [IDL.Vec(FarmAsset)], ['query']),
    'registerAsset' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Float64, IDL.Nat],
        [Result_1],
        [],
      ),
    'updateAssetStatus' : IDL.Func([IDL.Text, AssetStatus], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
