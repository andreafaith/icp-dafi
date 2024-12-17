import mongoose, { Document, Schema } from 'mongoose';
import { Principal } from '@dfinity/principal';

export interface IUser extends Document {
    principal: string;
    name: string;
    email: string;
    walletAddress: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
    role: 'farmer' | 'investor' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    lastLogin?: Date;
    settings: {
        notifications: boolean;
        twoFactorEnabled: boolean;
        language: string;
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
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['farmer', 'investor', 'admin'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    lastLogin: {
        type: Date,
    },
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
}, {
    timestamps: true,
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

// Methods
UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.settings.twoFactorEnabled;
    return obj;
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
