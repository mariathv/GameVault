const Ticket = require('../models/ticket');

const ticketController = {
    createTicket: async (req, res) => {
        try {
            const { subject, message } = req.body;
            const userId = req.user._id; // assuming you use auth middleware
            console.log(userId);
            const newTicket = new Ticket({
                userId,
                subject,
                message
            });
            console.log(newTicket);


            const savedTicket = await newTicket.save();
            res.status(201).json(savedTicket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create ticket', details: err.message });
        }
    },

    getAllTickets: async (req, res) => {
        try {
            const tickets = await Ticket.find().populate('userId', 'name email'); // adjust fields
            res.status(200).json(tickets);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch tickets' });
        }
    },

    getUserTickets: async (req, res) => {
        try {
            const userId = req.user._id;
            const tickets = await Ticket.find({ userId });
            res.status(200).json(tickets);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch user tickets' });
        }
    },

    replyToTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const { message } = req.body;
            const sender = req.user.role === 'admin' ? 'admin' : 'user';

            const ticket = await Ticket.findById(ticketId);
            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

            ticket.replies.push({ sender, message });
            ticket.updatedAt = new Date();

            const updatedTicket = await ticket.save();
            res.status(200).json(updatedTicket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to reply to ticket' });
        }
    },

    closeTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;

            const ticket = await Ticket.findByIdAndUpdate(
                ticketId,
                { status: 'closed', updatedAt: new Date() },
                { new: true }
            );

            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

            res.status(200).json(ticket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to close ticket' });
        }
    }
};

module.exports = ticketController;
