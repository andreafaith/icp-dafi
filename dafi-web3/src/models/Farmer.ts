import mongoose, { Schema, Document } from 'mongoose';
import { ILocation } from './common.types';

export interface IFarmer extends Document {
  did: string;  // Decentralized Identity
  walletAddress: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  farmInfo: {
    name: string;
    size: number;  // in hectares
    location: ILocation;
    crops: Array<{
      name: string;
      variety: string;
      area: number;
      plantingDate: Date;
      expectedHarvestDate: Date;
    }>;
    certifications: Array<{
      type: string;
      issuer: string;
      validUntil: Date;
      verificationUrl: string;
    }>;
  };
  financialInfo: {
    creditScore: number;
    bankDetails: {
      accountHolder: string;
      bankName: string;
      accountNumber: string;
      routingNumber: string;
    };
    annualRevenue: number;
    outstandingLoans: Array<{
      loanId: string;
      amount: number;
      interestRate: number;
      startDate: Date;
      endDate: Date;
      status: 'active' | 'paid' | 'defaulted';
    }>;
  };
  assets: Array<{
    tokenId: string;
    contractAddress: string;
    assetType: 'crop' | 'land' | 'equipment';
    quantity: number;
    value: number;
    metadata: Record<string, any>;
  }>;
  weatherContracts: Array<{
    contractId: string;
    contractAddress: string;
    coverageType: 'drought' | 'flood' | 'frost' | 'excess_rain';
    startDate: Date;
    endDate: Date;
    premium: number;
    coverageAmount: number;
    status: 'active' | 'expired' | 'claimed';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerSchema = new Schema<IFarmer>({
  did: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true, unique: true },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: String,
  },
  farmInfo: {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
      address: { type: String, required: true },
      country: { type: String, required: true },
    },
    crops: [{
      name: { type: String, required: true },
      variety: { type: String, required: true },
      area: { type: Number, required: true },
      plantingDate: { type: Date, required: true },
      expectedHarvestDate: { type: Date, required: true },
    }],
    certifications: [{
      type: { type: String, required: true },
      issuer: { type: String, required: true },
      validUntil: { type: Date, required: true },
      verificationUrl: { type: String, required: true },
    }],
  },
  financialInfo: {
    creditScore: { type: Number, required: true },
    bankDetails: {
      accountHolder: { type: String, required: true },
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      routingNumber: { type: String, required: true },
    },
    annualRevenue: { type: Number, required: true },
    outstandingLoans: [{
      loanId: { type: String, required: true },
      amount: { type: Number, required: true },
      interestRate: { type: Number, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { type: String, enum: ['active', 'paid', 'defaulted'], required: true },
    }],
  },
  assets: [{
    tokenId: { type: String, required: true },
    contractAddress: { type: String, required: true },
    assetType: { type: String, enum: ['crop', 'land', 'equipment'], required: true },
    quantity: { type: Number, required: true },
    value: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  }],
  weatherContracts: [{
    contractId: { type: String, required: true },
    contractAddress: { type: String, required: true },
    coverageType: { type: String, enum: ['drought', 'flood', 'frost', 'excess_rain'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    premium: { type: Number, required: true },
    coverageAmount: { type: Number, required: true },
    status: { type: String, enum: ['active', 'expired', 'claimed'], required: true },
  }],
}, { timestamps: true });

// Indexes
FarmerSchema.index({ did: 1 });
FarmerSchema.index({ walletAddress: 1 });
FarmerSchema.index({ 'farmInfo.location': '2dsphere' });

export default mongoose.models.Farmer || mongoose.model<IFarmer>('Farmer', FarmerSchema);
