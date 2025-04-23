const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open'
    },
    replies: [
        {
            sender: {
                type: String,
                enum: ['user', 'admin'],
                required: true
            },
            message: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Ticket = mongoose.model('ticket', ticketSchema);

module.exports = Ticket;
