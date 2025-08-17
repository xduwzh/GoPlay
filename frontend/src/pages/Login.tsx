import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../store";
import { fetchLogin } from "../apis/user";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await fetchLogin(values);
      if (response.status === 200) {
        dispatch(login(response.data));
        navigate("/");
        message.success("Login successful!");
        console.log("user", response.data.user.avatar);
      }
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px - 70px)",
      }}
    >
      <Card title="Login" style={{ width: 300, textAlign: "center" }}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 12 }}>
          <span style={{ color: "#666" }}>No Account？</span>
          <Button type="link" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
