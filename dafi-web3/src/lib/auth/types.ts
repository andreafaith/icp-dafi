import { Types } from 'mongoose';

export type UserRole = 'farmer' | 'investor' | 'admin' | 'verifier';

export interface UserProfile {
  _id: Types.ObjectId;
  did: string;
  walletAddress: string;
  roles: UserRole[];
  kycStatus: KYCStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type KYCStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export interface KYCDocument {
  type: 'passport' | 'nationalId' | 'drivingLicense' | 'utilityBill';
  documentId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  issueDate: Date;
  expiryDate?: Date;
  issuingCountry: string;
  verifiedBy?: string;
  verificationDate?: Date;
}

export interface AuthChallenge {
  challenge: string;
  expiresAt: Date;
}

export interface Web3AuthResponse {
  signature: string;
  address: string;
  chainId: number;
  message: string;
}

export interface DIDAuthResponse {
  did: string;
  verifiableCredential: string;
  proof: string;
}

export interface AuthSession {
  userId: string;
  did: string;
  walletAddress: string;
  roles: UserRole[];
  sessionId: string;
  expiresAt: Date;
  deviceInfo: {
    userAgent: string;
    ip: string;
    lastActive: Date;
  };
}
