import React from "react";
import { Menu, Dropdown, Button } from "antd";
import { Link } from "react-router-dom";

// Header component
const Header: React.FC = () => {
  const isLoggedIn = false; // Replace with actual authentication logic

  const languageMenu = (
    <Menu>
      <Menu.Item key="1">English</Menu.Item>
      <Menu.Item key="2">中文</Menu.Item>
    </Menu>
  );

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      {/* Website Title */}
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>GoPlay</div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {/* Language Switcher */}
        <Dropdown overlay={languageMenu} placement="bottomRight">
          <Button>Language</Button>
        </Dropdown>

        {/* Links */}
        <Link to="/">Home</Link>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <Link to="/profile">Account</Link>}
        {isLoggedIn && <Link to="/logout">Logout</Link>}
      </nav>
    </header>
  );
};

export default Header;
