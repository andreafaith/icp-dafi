import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestor extends Document {
  did: string;  // Decentralized Identity
  walletAddress: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    country: string;
    accreditationStatus: boolean;
  };
  investmentProfile: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    preferredSectors: string[];
    minimumInvestment: number;
    maximumInvestment: number;
    investmentHorizon: number; // in months
    preferredRegions: string[];
  };
  portfolio: {
    totalInvested: number;
    activeInvestments: Array<{
      assetId: string;
      contractAddress: string;
      amount: number;
      purchaseDate: Date;
      expectedReturn: number;
      maturityDate?: Date;
      status: 'active' | 'matured' | 'defaulted';
    }>;
    historicalReturns: Array<{
      year: number;
      month: number;
      return: number;
    }>;
  };
  kycStatus: {
    verified: boolean;
    verificationDate?: Date;
    verifier: string;
    documents: Array<{
      type: string;
      url: string;
      verified: boolean;
      uploadDate: Date;
    }>;
  };
  notifications: Array<{
    type: 'opportunity' | 'risk' | 'return' | 'system';
    message: string;
    date: Date;
    read: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const InvestorSchema = new Schema<IInvestor>({
  did: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true, unique: true },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: String,
    country: { type: String, required: true },
    accreditationStatus: { type: Boolean, default: false },
  },
  investmentProfile: {
    riskTolerance: { 
      type: String, 
      enum: ['conservative', 'moderate', 'aggressive'], 
      required: true 
    },
    preferredSectors: [{ type: String }],
    minimumInvestment: { type: Number, required: true },
    maximumInvestment: { type: Number, required: true },
    investmentHorizon: { type: Number, required: true },
    preferredRegions: [{ type: String }],
  },
  portfolio: {
    totalInvested: { type: Number, default: 0 },
    activeInvestments: [{
      assetId: { type: String, required: true },
      contractAddress: { type: String, required: true },
      amount: { type: Number, required: true },
      purchaseDate: { type: Date, required: true },
      expectedReturn: { type: Number, required: true },
      maturityDate: Date,
      status: { 
        type: String, 
        enum: ['active', 'matured', 'defaulted'], 
        required: true 
      },
    }],
    historicalReturns: [{
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      return: { type: Number, required: true },
    }],
  },
  kycStatus: {
    verified: { type: Boolean, default: false },
    verificationDate: Date,
    verifier: String,
    documents: [{
      type: { type: String, required: true },
      url: { type: String, required: true },
      verified: { type: Boolean, default: false },
      uploadDate: { type: Date, required: true },
    }],
  },
  notifications: [{
    type: { 
      type: String, 
      enum: ['opportunity', 'risk', 'return', 'system'], 
      required: true 
    },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  }],
}, { timestamps: true });

// Indexes
InvestorSchema.index({ did: 1 });
InvestorSchema.index({ walletAddress: 1 });
InvestorSchema.index({ 'personalInfo.email': 1 });
InvestorSchema.index({ 'portfolio.totalInvested': -1 });

export default mongoose.models.Investor || mongoose.model<IInvestor>('Investor', InvestorSchema);
