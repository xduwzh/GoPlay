import React from "react";
import { Dropdown, Button } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import { useNavigate } from "react-router-dom";

// Header component
const Header: React.FC = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const languageMenu = {
    items: [
      { key: "1", label: "English" },
      { key: "2", label: "中文" },
    ],
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#fff",
        height: 64,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: "100%",
      }}
    >
      {/* Website Title */}
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>GoPlay</div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {/* Language Switcher */}
        <Dropdown menu={languageMenu} placement="bottomRight">
          <Button>Language</Button>
        </Dropdown>

        {/* Links */}
        <Link to="/">Home</Link>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <Link to="/profile">Profile</Link>}
        {isLoggedIn && (
          <Button
            type="link"
            onClick={handleLogout}
            style={{
              padding: 0,
              color: "#1677ff", // Match other links
              textDecoration: "none",
              fontSize: "inherit",
              fontWeight: "inherit",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;
