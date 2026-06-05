import api from './api';

export const ticketService = {
  /**
   * Create a new ticket (FormData for file upload support)
   */
  createTicket: async (formData) => {
    const { data } = await api.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data; // { ticketNumber, status, createdAt }
  },

  /**
   * Track a ticket by its number (public)
   * @param {string} ticketNumber - e.g. TKT-202406-00001
   * @param {object} options - axios options (signal, etc.)
   */
  trackTicket: async (ticketNumber, options = {}) => {
    const { data } = await api.get(`/tickets/track/${ticketNumber}`, options);
    return data.data; // { ticket }
  },
};
