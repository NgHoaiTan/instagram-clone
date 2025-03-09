import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import getDataUri from '../config/datauri.js';
import cloudinary from '../config/cloudinary.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false
            })
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Email already exists, try different email",
                success: false
            })
        };

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashPassword,

        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: 'Something is missing, please check!',
                success: false
            });
        }
        let user = await User.findOne({ email }).select('--password');
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user: user
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie('token', "", { maxAge: 0 }).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('--password');
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('--password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            })
        };
        if (bio) {
            user.bio = bio;
        }
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated',
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
};



export const getSuggestedUsers = async (req, res) => {

    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select('--password');
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users'
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
}

export const followOrUnfollowUser = async (req, res) => {
    try {
        const followerId = req.id;
        const followingId = req.params.id;
        if (followerId === followingId) {
            return res.status(400).json({
                message: 'You can not follow yourself',
                success: false
            })
        }
        const user = await User.findById(followerId);
        const targetUser = await User.findById(followingId);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            })
        }
        const isFollowing = user.following.includes(followingId);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followerId }, { $pull: { following: followingId } }),
                User.updateOne({ _id: followingId }, { $pull: { followers: followerId } }),
            ])

            return res.status(200).json({
                message: 'Unfollow successfully',
                success: true
            })

        } else {
            await Promise.all([
                User.updateOne({ _id: followerId }, { $push: { following: followingId } }),
                User.updateOne({ _id: followingId }, { $push: { followers: followerId } }),
            ])

            return res.status(200).json({
                message: 'Follow successfully',
                success: true
            })
        }
    } catch (error) {

    }
}