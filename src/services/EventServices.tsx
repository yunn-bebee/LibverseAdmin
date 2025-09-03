import { getData,  deleteData, uploadMultimedia, updateMultimedia } from '../app/api';
import { url } from '../app/url';
import type { Event, EventFilters } from '../app/types/event';

export const eventService = {
  getEvents: async (filters: EventFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${url.event.index}?${queryString}`
      : url.event.index;
    
    return await getData(endpoint);
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await getData(url.event.show(id));
    return response.data;
  },

  createEvent: async (data: FormData): Promise<Event> => {
    const response = await uploadMultimedia<Event>(url.event.store, data);
    return response.data;
  },

  updateEvent: async (id: string, data: FormData): Promise<Event> => {
    data.append('_method', 'PUT'); // For Laravel compatibility
    const response = await updateMultimedia<Event>(url.event.update(id), data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await deleteData(url.event.destroy(id));
  },
};