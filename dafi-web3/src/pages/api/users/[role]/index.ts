import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../../lib/db/mongodb';
import { authMiddleware, roleGuard } from '../../../../middleware/auth';
import { User } from '../../../../models/User';
import { rateLimit } from '../../../../middleware/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        await rateLimit(req, res);

        const { role } = req.query;
        if (!['farmer', 'investor'].includes(role as string)) {
            return res.status(400).json({ error: 'Invalid role specified' });
        }

        switch (req.method) {
            case 'GET':
                return await getUsers(req, res, role as string);
            case 'POST':
                return await createUser(req, res, role as string);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('User API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse, role: string) {
    try {
        const { status, location, sort = '-createdAt', page = 1, limit = 10 } = req.query;

        const query: any = { role };
        if (status) query.status = status;
        if (location) query['profile.location'] = location;

        const users = await User.find(query)
            .sort(sort as string)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .select('-security -apiKeys');

        const total = await User.countDocuments(query);

        return res.status(200).json({
            users,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
}

async function createUser(req: NextApiRequest, res: NextApiResponse, role: string) {
    try {
        const { name, email, walletAddress, profile } = req.body;

        if (!name || !email || !walletAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { walletAddress }],
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            walletAddress,
            role,
            status: 'pending',
            profile,
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
}
