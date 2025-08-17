import React, { useEffect } from "react";
import AppRouter from "./router";
import "./App.css";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./apis/user";
import { setUser, logout } from "./store";
import { getToken } from "./utils/token";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetchProfile()
      .then((res) => {
        const { username, avatar } = res.data || {};
        dispatch(setUser({ username, avatar }));
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [dispatch]);

  return (
    <div>
      <AppRouter />
    </div>
  );
};

export default App;
