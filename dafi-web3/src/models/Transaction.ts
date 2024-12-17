import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  type: 'investment' | 'withdrawal' | 'transfer' | 'claim' | 'stake' | 'unstake';
  status: 'pending' | 'completed' | 'failed';
  from: string;  // DID or wallet address
  to: string;    // DID or wallet address
  asset: {
    tokenId: string;
    contractAddress: string;
    assetType: string;
    amount: number;
    price: number;
  };
  details: {
    description: string;
    metadata: Record<string, any>;
  };
  fees: {
    gas: number;
    platform: number;
    total: number;
  };
  audit: {
    ipfsHash: string;
    signatures: Array<{
      signer: string;
      signature: string;
      timestamp: Date;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionHash: { type: String, required: true, unique: true },
  blockNumber: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['investment', 'withdrawal', 'transfer', 'claim', 'stake', 'unstake'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    required: true 
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  asset: {
    tokenId: { type: String, required: true },
    contractAddress: { type: String, required: true },
    assetType: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  details: {
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  fees: {
    gas: { type: Number, required: true },
    platform: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  audit: {
    ipfsHash: { type: String, required: true },
    signatures: [{
      signer: { type: String, required: true },
      signature: { type: String, required: true },
      timestamp: { type: Date, required: true },
    }],
  },
}, { timestamps: true });

// Indexes
TransactionSchema.index({ transactionHash: 1 });
TransactionSchema.index({ blockNumber: 1 });
TransactionSchema.index({ timestamp: -1 });
TransactionSchema.index({ from: 1 });
TransactionSchema.index({ to: 1 });
TransactionSchema.index({ 'asset.tokenId': 1 });
TransactionSchema.index({ type: 1, status: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
