import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    principal: string;
    name?: string;
    email?: string;
    walletType: string;
    walletAddress?: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
    isKYCVerified: boolean;
    roles: string[];
    status: 'active' | 'inactive' | 'suspended';
    lastLogin?: Date;
    settings?: {
        notifications: boolean;
        twoFactorEnabled: boolean;
        language: string;
    };
    kycData?: {
        documentType?: string;
        documentNumber?: string;
        verificationStatus: 'pending' | 'verified' | 'rejected';
        submissionDate?: Date;
        verificationDate?: Date;
        rejectionReason?: string;
    };
}

const UserSchema = new Schema<IUser>({
    principal: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    walletType: {
        type: String,
        required: true,
        enum: ['walletmask', 'plug', 'stoic'],
    },
    walletAddress: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    avatar: String,
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isKYCVerified: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: [String],
        default: ['user'],
        enum: ['user', 'farmer', 'investor', 'admin'],
        index: true,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive', 'suspended'],
        index: true,
    },
    lastLogin: Date,
    settings: {
        notifications: {
            type: Boolean,
            default: true,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        language: {
            type: String,
            default: 'en',
        },
    },
    kycData: {
        documentType: String,
        documentNumber: String,
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        submissionDate: Date,
        verificationDate: Date,
        rejectionReason: String,
    },
}, {
    timestamps: true,
});

// Methods
UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.settings.twoFactorEnabled;
    return obj;
};

// Update the updatedAt field on save
UserSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const UserModel = User;  // Add this line for backward compatibility
