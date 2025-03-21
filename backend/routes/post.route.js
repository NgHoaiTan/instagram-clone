import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, disLikePost, getAllPosts, getCommentsOfPost, likePost } from '../controllers/post.controller.js';

const router = express.Router();

router.route('/addPost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPosts);
router.route('/userpost/all').get(isAuthenticated, getAllPosts);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, disLikePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost);
router.route('/delete/:id').post(isAuthenticated, deletePost);
router.route('/:id/bookmark').post(isAuthenticated, bookmarkPost);

export default router;