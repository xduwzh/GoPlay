import request from "./request";

export const fetchEvents = () => {
  return request.get("/events");
};
