import sharp from 'sharp';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!caption && !image) {
            return res.status(400).json({
                message: 'Please fill in all fields'
            })
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg?base64,${optimizedImageBuffer.toString('base64')}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '--password' });

        return res.status(200).json({
            success: true,
            message: 'Post created successfully',
            post
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createAt: -1 })
            .populate({ path: author, select: 'username, profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            });
        return res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        // implement socket io for real time notification        



        return res.status(200).json({
            success: true,
            message: 'Post liked successfully'
        })
    } catch (error) {
        console.log(error);
    }
}

export const disLikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        // implement socket io for real time notification        



        return res.status(200).json({
            success: true,
            message: 'Post disliked successfully'
        })
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        if (!text) {
            return res.status(400).json({
                message: 'Please enter a comment',
                success: false
            })
        }
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        }).populate({ path: 'author', select: 'username profilePicture' });

        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            comment
        })
    } catch (error) {
        console.log(error);
    }

}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }
        const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' });

        if (!comments) {
            return res.status(404).json({
                message: 'No comments found this post',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        // check if the user is the author of the post
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post',
                success: false
            })
        }

        // delete the post
        await Post.findByIdAndDelete(postId);

        // delete the post from the user
        await User.updateOne({ _id: authorId }, { $pull: { posts: postId } });

        // delete all comments of the post
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        })
    } catch (error) {
        console.log(error);

    }

}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            })
        }

        if (user.bookmarks.includes(postId)) {
            // remove the post from the user bookmarks
            await user.updateOne({ $pull: { bookmarks: postId } });
            await user.save();
            return res.status(200).json({
                type: 'unsaved',
                success: true,
                message: 'Post removed from bookmarks'
            })
        } else {
            // add the post from the user bookmarks
            await user.updateOne({ $addToSet: { bookmarks: postId } });
            return res.status(200).json({
                type: 'saved',
                success: true,
                message: 'Post bookmarked successfully'
            })
        }

    } catch (error) {
        console.log(error);
    }

}
