import request from "./request";

export const fetchEvents = () => {
  return request.get("/events");
};

export const fetchEventById = (id: number) => {
  return request.get(`/events/${id}`);
};

export const registerForEvent = (id: number) => {
  return request.put(`/events/${id}/register`);
};

export const cancelRegistration = (id: number) => {
  return request.delete(`/events/${id}/register`);
};
