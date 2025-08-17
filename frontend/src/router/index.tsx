import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import EventInfo from "../pages/EventInfo";
import Header from "../components/Header";

const { Content, Footer } = Layout;

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Content style={{ padding: "20px", marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/event/:id" element={<EventInfo />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          GoPlay ©2025 Created by xduwzh
        </Footer>
      </Layout>
    </Router>
  );
};

export default AppRouter;
