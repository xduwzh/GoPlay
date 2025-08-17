import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  message,
  Space,
  Upload,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, updateProfile, presignAvatarUpload } from "../apis/user";
import { setUser } from "../store";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: any) => state.user.username);
  const avatar = useSelector((state: any) => state.user.avatar);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
      const payload: any = {};
      if (values.username) payload.username = values.username;
      if (values.password) payload.password = values.password;
      // 1) If an avatar file is chosen, get a presigned URL and upload the file
      if (avatarFile) {
        const presignRes = await presignAvatarUpload({
          filename: avatarFile.name,
          contentType: avatarFile.type || "application/octet-stream",
        });
        const { uploadUrl, publicUrl, contentType } = presignRes.data;
        // Use fetch to PUT directly to S3
        const putResp = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: avatarFile,
        });
        if (!putResp.ok) {
          throw new Error("Failed to upload avatar to S3");
        }
        payload.avatar = publicUrl;
      }
      const res = await updateProfile(payload);
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
            <Form.Item label="Avatar">
              <Upload
                accept="image/*"
                maxCount={1}
                showUploadList={{ showRemoveIcon: true }}
                beforeUpload={(file) => {
                  setAvatarFile(file);
                  return false; // prevent auto upload
                }}
                onRemove={() => setAvatarFile(null)}
              >
                <Button>Select Image</Button>
              </Upload>
              <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
                {avatarFile ? (
                  <span>
                    Selected: {avatarFile.name}. The image will be uploaded
                    after you click Save.
                  </span>
                ) : (
                  <span>The image will be uploaded after you click Save.</span>
                )}
              </div>
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
