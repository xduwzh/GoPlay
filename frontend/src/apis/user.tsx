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

export const updateProfile = (data: {
  username?: string;
  password?: string;
  avatar?: string;
}) => {
  return request.put("/profile", data);
};
