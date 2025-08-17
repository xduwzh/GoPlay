import request from "./request";

export const fetchLogin = (data: { username: string; password: string }) => {
  return request.post("/login", data);
};

export const fetchRegister = (data: { username: string; password: string }) => {
  return request.post("/register", data);
};

export const fetchProfile = () => {
  return request.get("/profile");
};
