import api from './api';

export const adminService = {
  getDashboard: async (options = {}) => {
    const { data } = await api.get('/admin/dashboard', options);
    return data.data; // { stats, latestTickets }
  },

  getTickets: async (params = {}, options = {}) => {
    const { data } = await api.get('/admin/tickets', { params, ...options });
    return data; // { success, data[], pagination }
  },

  getTicketById: async (id, options = {}) => {
    const { data } = await api.get(`/admin/tickets/${id}`, options);
    return data.data; // { ticket }
  },

  updateTicket: async (id, updates) => {
    const { data } = await api.put(`/admin/tickets/${id}`, updates);
    return data.data; // { ticket }
  },

  bulkArchive: async (ticketIds) => {
    const { data } = await api.post('/admin/tickets/bulk-archive', { ticketIds });
    return data.data; // { requested, matched, modified }
  },

  bulkRestore: async (ticketIds) => {
    const { data } = await api.post('/admin/tickets/bulk-restore', { ticketIds });
    return data.data; // { requested, matched, modified }
  },
};
