import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { 
  UserProfile, 
  AuthToken, 
  Web3AuthResponse, 
  DIDAuthResponse,
  AuthSession,
  UserRole
} from './types';
import { Web3AuthService } from './web3Auth';
import { DIDAuthService } from './didAuth';
import { KYCService } from './kycService';
import { UserModel } from '../../models/User';

export class AuthService {
  private readonly web3Auth: Web3AuthService;
  private readonly didAuth: DIDAuthService;
  private readonly kycService: KYCService;
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;

  constructor(
    jwtSecret: string,
    jwtRefreshSecret: string,
    kycProviderUrl: string,
    kycApiKey: string
  ) {
    this.web3Auth = new Web3AuthService();
    this.didAuth = new DIDAuthService();
    this.kycService = new KYCService(kycProviderUrl, kycApiKey);
    this.JWT_SECRET = jwtSecret;
    this.JWT_REFRESH_SECRET = jwtRefreshSecret;
  }

  async authenticate(
    web3Auth: Web3AuthResponse,
    didAuth: DIDAuthResponse
  ): Promise<AuthToken> {
    // Verify Web3 wallet signature
    const isWeb3Valid = await this.web3Auth.authenticateWeb3(web3Auth);
    if (!isWeb3Valid) {
      throw new Error('Web3 authentication failed');
    }

    // Verify DID credentials
    const isDIDValid = await this.didAuth.authenticateDID(didAuth);
    if (!isDIDValid) {
      throw new Error('DID authentication failed');
    }

    // Get or create user profile
    const user = await this.findOrCreateUser(web3Auth.address, didAuth.did);

    // Create session
    const session = await this.createSession(user);

    // Generate tokens
    return this.generateTokens(session);
  }

  private async findOrCreateUser(
    walletAddress: string,
    did: string
  ): Promise<UserProfile> {
    let user = await UserModel.findOne({ walletAddress });

    if (!user) {
      user = await UserModel.create({
        walletAddress,
        did,
        roles: ['investor'], // Default role
        kycStatus: 'pending',
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
      });
    }

    return user;
  }

  private async createSession(user: UserProfile): Promise<AuthSession> {
    const session: AuthSession = {
      userId: user._id.toString(),
      did: user.did,
      walletAddress: user.walletAddress,
      roles: user.roles,
      sessionId: new Types.ObjectId().toString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      deviceInfo: {
        userAgent: '', // To be filled by the client
        ip: '', // To be filled by the client
        lastActive: new Date(),
      },
    };

    // Store session in database or cache
    // await SessionModel.create(session);

    return session;
  }

  private generateTokens(session: AuthSession): AuthToken {
    const accessToken = jwt.sign(
      {
        userId: session.userId,
        sessionId: session.sessionId,
        roles: session.roles,
      },
      this.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: session.userId,
        sessionId: session.sessionId,
      },
      this.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as {
        userId: string;
        sessionId: string;
      };

      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify session is still valid
      // const session = await SessionModel.findOne({ sessionId: decoded.sessionId });
      // if (!session || session.expiresAt < new Date()) {
      //   throw new Error('Session expired');
      // }

      const session: AuthSession = {
        userId: user._id.toString(),
        did: user.did,
        walletAddress: user.walletAddress,
        roles: user.roles,
        sessionId: decoded.sessionId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        deviceInfo: {
          userAgent: '',
          ip: '',
          lastActive: new Date(),
        },
      };

      return this.generateTokens(session);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async checkRole(userId: string, requiredRole: UserRole): Promise<boolean> {
    const user = await UserModel.findById(userId);
    return user?.roles.includes(requiredRole) || false;
  }

  async revokeSession(sessionId: string): Promise<void> {
    // Implement session revocation logic
    // await SessionModel.deleteOne({ sessionId });
  }
}
