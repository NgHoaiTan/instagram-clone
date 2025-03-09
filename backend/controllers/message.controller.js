import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message,
        });

        if (newMessage) {
            conversation.message.push(newMessage._id);
        }
        await Promise.all([conversation.save(), newMessage.save()]);

        // socket.io implementation for real time notification

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            newMessage
        });
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            return res.status(200).json({
                success: true,
                message: []
            });
        }
        return res.status(200).json({
            success: true,
            message: conversation?.message
        });

    } catch (error) {
        console.log(error);

    }
}