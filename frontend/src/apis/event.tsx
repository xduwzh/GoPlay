import request from "./request";

export const fetchEvents = () => {
  return request.get("/events");
};

export const fetchEventById = (id: number) => {
  return request.get(`/events/${id}`);
};
