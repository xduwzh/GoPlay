import request from "./request";

export const fetchLogin = (data: { username: string; password: string }) => {
  return request.post("/login", data);
};
