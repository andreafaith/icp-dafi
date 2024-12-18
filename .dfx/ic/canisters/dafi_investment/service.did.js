export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const InvestmentStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Defaulted' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const Investment = IDL.Record({
    'id' : IDL.Text,
    'status' : InvestmentStatus,
    'duration' : IDL.Int,
    'farmerId' : IDL.Principal,
    'investorId' : IDL.Principal,
    'interestRate' : IDL.Float64,
    'amount' : IDL.Nat,
    'startDate' : IDL.Int,
  });
  const Result = IDL.Variant({ 'ok' : Investment, 'err' : IDL.Text });
  return IDL.Service({
    'completeInvestment' : IDL.Func([IDL.Text], [Result_2], []),
    'createInvestment' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Float64, IDL.Int],
        [Result_1],
        [],
      ),
    'getInvestment' : IDL.Func([IDL.Text], [Result], ['query']),
    'getInvestmentsByFarmer' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Investment)],
        ['query'],
      ),
    'getInvestmentsByInvestor' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Investment)],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
