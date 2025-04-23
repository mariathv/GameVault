import api from './index';

// Create a new ticket
export const createTicket = async (newTicket) => {
    try {
        console.log("Creating ticket:", newTicket);
        const response = await api.post('/ticket/create', newTicket);
        return response.data;
    } catch (error) {
        console.error('Failed to create ticket:', error?.response?.data || error.message);
        throw error;
    }
};

// Fetch all tickets for the current user
export const fetchUserTickets = async () => {
    try {
        console.log("Fetching user tickets");
        const response = await api.get('/ticket/my');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tickets:', error?.response?.data || error.message);
        throw error;
    }
};

// Send a reply to an existing ticket
export const sendTicketReply = async (ticketId, message) => {
    try {
        console.log("Sending reply to ticket:", ticketId);
        const response = await api.post(`/ticket/${ticketId}/reply`, { message });
        return response.data;
    } catch (error) {
        console.error('Failed to send reply:', error?.response?.data || error.message);
        throw error;
    }
};

// Close a ticket
export const closeTicket = async (ticketId) => {
    try {
        console.log("Closing ticket:", ticketId);
        const response = await api.put(`/ticket/${ticketId}/close`);
        return response.data;
    } catch (error) {
        console.error('Failed to close ticket:', error?.response?.data || error.message);
        throw error;
    }
};