export const idlFactory = ({ IDL }) => {
  const DocumentType = IDL.Variant({
    'passport': IDL.Null,
    'national_id': IDL.Null,
    'driving_license': IDL.Null,
  });

  const DocumentStatus = IDL.Variant({
    'pending': IDL.Null,
    'approved': IDL.Null,
    'rejected': IDL.Record({ reason: IDL.Text }),
  });

  const Document = IDL.Record({
    'id': IDL.Text,
    'type': DocumentType,
    'hash': IDL.Text,
    'timestamp': IDL.Nat64,
    'status': DocumentStatus,
  });

  const UserType = IDL.Variant({
    'farmer': IDL.Null,
    'investor': IDL.Null,
  });

  const KYCData = IDL.Record({
    'firstName': IDL.Text,
    'lastName': IDL.Text,
    'dateOfBirth': IDL.Text,
    'nationality': IDL.Text,
    'address': IDL.Text,
    'userType': UserType,
    'documents': IDL.Vec(Document),
    'status': DocumentStatus,
    'verifiedAt': IDL.Opt(IDL.Nat64),
  });

  return IDL.Service({
    'submitKYC': IDL.Func([KYCData], [IDL.Text], []),
    'uploadDocument': IDL.Func([IDL.Text, DocumentType, IDL.Vec(IDL.Nat8)], [Document], []),
    'getKYCStatus': IDL.Func([IDL.Text], [DocumentStatus], ['query']),
    'verifyKYC': IDL.Func([IDL.Text], [DocumentStatus], []),
    'isVerified': IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
  });
};
