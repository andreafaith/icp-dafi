import mongoose, { Schema, Document } from 'mongoose';
import { ILocation } from './common.types';

export interface IAgriculturalAsset extends Document {
  tokenId: string;
  contractAddress: string;
  assetType: 'crop' | 'land' | 'equipment' | 'livestock';
  owner: string;  // DID of the owner
  details: {
    name: string;
    description: string;
    location: ILocation;
    images: string[];
    documents: Array<{
      type: string;
      url: string;
      verified: boolean;
    }>;
  };
  valuation: {
    currentValue: number;
    currency: string;
    lastValuationDate: Date;
    valuationHistory: Array<{
      value: number;
      date: Date;
      assessor: string;
    }>;
  };
  tokenization: {
    totalSupply: number;
    circulatingSupply: number;
    pricePerToken: number;
    minimumInvestment: number;
    tradingStatus: 'active' | 'paused' | 'ended';
    holders: Array<{
      investorDid: string;
      amount: number;
      purchaseDate: Date;
      purchasePrice: number;
    }>;
  };
  performance: {
    yieldHistory: Array<{
      period: string;
      actualYield: number;
      expectedYield: number;
      unit: string;
    }>;
    ratings: Array<{
      category: string;
      score: number;
      date: Date;
      rater: string;
    }>;
  };
  risk: {
    riskScore: number;
    riskFactors: Array<{
      type: string;
      probability: number;
      impact: number;
      mitigationStrategy: string;
    }>;
    insurance: Array<{
      type: string;
      provider: string;
      coverageAmount: number;
      startDate: Date;
      endDate: Date;
      status: 'active' | 'expired' | 'claimed';
    }>;
  };
  compliance: {
    certifications: Array<{
      type: string;
      issuer: string;
      validUntil: Date;
      verificationUrl: string;
    }>;
    audits: Array<{
      date: Date;
      auditor: string;
      report: string;
      findings: string[];
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AgriculturalAssetSchema = new Schema<IAgriculturalAsset>({
  tokenId: { type: String, required: true, unique: true },
  contractAddress: { type: String, required: true },
  assetType: { 
    type: String, 
    enum: ['crop', 'land', 'equipment', 'livestock'], 
    required: true 
  },
  owner: { type: String, required: true },
  details: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true },
      country: { type: String, required: true },
    },
    images: [{ type: String }],
    documents: [{
      type: { type: String, required: true },
      url: { type: String, required: true },
      verified: { type: Boolean, default: false },
    }],
  },
  valuation: {
    currentValue: { type: Number, required: true },
    currency: { type: String, required: true },
    lastValuationDate: { type: Date, required: true },
    valuationHistory: [{
      value: { type: Number, required: true },
      date: { type: Date, required: true },
      assessor: { type: String, required: true },
    }],
  },
  tokenization: {
    totalSupply: { type: Number, required: true },
    circulatingSupply: { type: Number, required: true },
    pricePerToken: { type: Number, required: true },
    minimumInvestment: { type: Number, required: true },
    tradingStatus: { 
      type: String, 
      enum: ['active', 'paused', 'ended'], 
      required: true 
    },
    holders: [{
      investorDid: { type: String, required: true },
      amount: { type: Number, required: true },
      purchaseDate: { type: Date, required: true },
      purchasePrice: { type: Number, required: true },
    }],
  },
  performance: {
    yieldHistory: [{
      period: { type: String, required: true },
      actualYield: { type: Number, required: true },
      expectedYield: { type: Number, required: true },
      unit: { type: String, required: true },
    }],
    ratings: [{
      category: { type: String, required: true },
      score: { type: Number, required: true },
      date: { type: Date, required: true },
      rater: { type: String, required: true },
    }],
  },
  risk: {
    riskScore: { type: Number, required: true },
    riskFactors: [{
      type: { type: String, required: true },
      probability: { type: Number, required: true },
      impact: { type: Number, required: true },
      mitigationStrategy: { type: String, required: true },
    }],
    insurance: [{
      type: { type: String, required: true },
      provider: { type: String, required: true },
      coverageAmount: { type: Number, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { 
        type: String, 
        enum: ['active', 'expired', 'claimed'], 
        required: true 
      },
    }],
  },
  compliance: {
    certifications: [{
      type: { type: String, required: true },
      issuer: { type: String, required: true },
      validUntil: { type: Date, required: true },
      verificationUrl: { type: String, required: true },
    }],
    audits: [{
      date: { type: Date, required: true },
      auditor: { type: String, required: true },
      report: { type: String, required: true },
      findings: [{ type: String }],
    }],
  },
}, { timestamps: true });

// Indexes
AgriculturalAssetSchema.index({ tokenId: 1 });
AgriculturalAssetSchema.index({ contractAddress: 1 });
AgriculturalAssetSchema.index({ owner: 1 });
AgriculturalAssetSchema.index({ 'details.location': '2dsphere' });
AgriculturalAssetSchema.index({ 'valuation.currentValue': -1 });

export default mongoose.models.AgriculturalAsset || mongoose.model<IAgriculturalAsset>('AgriculturalAsset', AgriculturalAssetSchema);
