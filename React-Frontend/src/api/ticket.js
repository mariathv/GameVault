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
export const fetchAllTickets = async () => {
    try {
        console.log("Fetching all tickets");
        const response = await api.get('/ticket/all');
        console.log("tickets", response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tickets:', error?.response?.data || error.message);
        throw error;
    }
};

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

export const closeTicket = async (ticketId) => {
    try {
        console.log("Closing ticket:", ticketId);
        const response = await api.patch(`/ticket/${ticketId}/close`);
        return response.data;
    } catch (error) {
        console.error('Failed to close ticket:', error?.response?.data || error.message);
        throw error;
    }
};

export const updateTicketStatus = async (ticketId, status) => {
    const response = await api.patch(`/ticket/${ticketId}/status`, { status });

    if (response.status !== 200) {
      throw new Error('Failed to update ticket status');
    }
    
    return response.data;
    
  };