import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { User } from '../models/User';
import { generateJwtToken, verifyJwtToken } from '../utils/jwt';
import { SecurityMonitor } from './SecurityMonitor';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, setSession } from '../lib/session';
import { createHash } from 'crypto';

export class AuthService {
    private securityMonitor: SecurityMonitor;

    constructor() {
        this.securityMonitor = new SecurityMonitor();
    }

    async authenticateUser(req: NextApiRequest, res: NextApiResponse) {
        try {
            // Create auth client
            const authClient = await AuthClient.create();
            
            // Check if user is authenticated with Internet Identity
            const isAuthenticated = await authClient.isAuthenticated();
            if (!isAuthenticated) {
                throw new Error('Not authenticated with Internet Identity');
            }

            // Get user identity and principal
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal();

            // Find or create user in database
            let user = await User.findOne({ principal: principal.toString() });
            
            if (!user) {
                user = await User.create({
                    principal: principal.toString(),
                    status: 'active',
                    role: 'user',
                    security: {
                        lastLogin: new Date(),
                        loginAttempts: [],
                        flags: [],
                    },
                });
            }

            // Generate JWT token
            const token = await generateJwtToken({
                userId: user._id,
                principal: principal.toString(),
                role: user.role,
            });

            // Create session
            const session = {
                userId: user._id,
                principal: principal.toString(),
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            };

            await setSession(req, res, session);

            // Monitor login activity
            await this.securityMonitor.monitorLoginAttempts(req, user._id, true);

            // Update user's last login
            await User.findByIdAndUpdate(user._id, {
                'security.lastLogin': new Date(),
                $push: {
                    'security.loginAttempts': {
                        timestamp: new Date(),
                        success: true,
                        ip: req.socket.remoteAddress,
                        userAgent: req.headers['user-agent'],
                    },
                },
            });

            return {
                user,
                token,
                principal: principal.toString(),
            };
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    async validateSession(req: NextApiRequest, res: NextApiResponse) {
        try {
            const session = await getSession(req, res);
            if (!session) {
                throw new Error('No session found');
            }

            // Verify JWT token
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }

            const decoded = await verifyJwtToken(token);
            if (!decoded) {
                throw new Error('Invalid token');
            }

            // Verify user exists and is active
            const user = await User.findOne({
                _id: decoded.userId,
                status: 'active',
            });

            if (!user) {
                throw new Error('User not found or inactive');
            }

            return {
                user,
                principal: decoded.principal,
            };
        } catch (error) {
            console.error('Session validation error:', error);
            throw error;
        }
    }

    async generateApiKey(userId: string) {
        try {
            const apiKey = createHash('sha256')
                .update(userId + Date.now().toString())
                .digest('hex');

            await User.findByIdAndUpdate(userId, {
                $push: {
                    apiKeys: {
                        key: apiKey,
                        name: 'API Key',
                        active: true,
                        createdAt: new Date(),
                    },
                },
            });

            return apiKey;
        } catch (error) {
            console.error('API key generation error:', error);
            throw error;
        }
    }

    async revokeApiKey(userId: string, apiKey: string) {
        try {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    'apiKeys.$[key].active': false,
                    'apiKeys.$[key].revokedAt': new Date(),
                },
            }, {
                arrayFilters: [{ 'key.key': apiKey }],
            });
        } catch (error) {
            console.error('API key revocation error:', error);
            throw error;
        }
    }

    async updateUserRole(userId: string, newRole: string) {
        try {
            const allowedRoles = ['user', 'admin', 'farmer', 'investor'];
            if (!allowedRoles.includes(newRole)) {
                throw new Error('Invalid role');
            }

            await User.findByIdAndUpdate(userId, {
                role: newRole,
            });
        } catch (error) {
            console.error('Role update error:', error);
            throw error;
        }
    }

    async updateSecuritySettings(userId: string, settings: any) {
        try {
            await User.findByIdAndUpdate(userId, {
                'settings.security': settings,
            });
        } catch (error) {
            console.error('Security settings update error:', error);
            throw error;
        }
    }

    async logout(req: NextApiRequest, res: NextApiResponse) {
        try {
            // Clear session
            await setSession(req, res, null);

            // Logout from Internet Identity
            const authClient = await AuthClient.create();
            await authClient.logout();

            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
}
