import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Avatar, message, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, updateProfile } from "../apis/user";
import { setUser } from "../store";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: any) => state.user.username);
  const avatar = useSelector((state: any) => state.user.avatar);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure we have latest profile from server
    setLoading(true);
    fetchProfile()
      .then((res) => {
        const { username: u, avatar: a } = res.data || {};
        dispatch(setUser({ username: u, avatar: a }));
      })
      .catch(() => {
        message.error("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await updateProfile(values);
      const { username: u, avatar: a } = res.data || {};
      dispatch(setUser({ username: u, avatar: a }));
      message.success("Profile updated");
    } catch (e: any) {
      message.error(e?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card title="My Profile" style={{ width: 420 }} loading={loading}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar size={64} src={avatar || undefined}>
              {username?.[0]?.toUpperCase()}
            </Avatar>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{username}</div>
              <div style={{ color: "#888" }}>Your public profile</div>
            </div>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ username, avatar }}
          >
            <Form.Item label="Username" name="username">
              <Input placeholder="Enter new username" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
            <Form.Item label="Avatar URL" name="avatar">
              <Input placeholder="https://..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Profile;
