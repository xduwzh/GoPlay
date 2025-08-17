import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchEventById } from "../apis/event";
import "./EventInfo.css";

const { Title, Text } = Typography;

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  description: string;
  registeredPlayers: string[];
  waitingListPlayers: string[];
}

const EventInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetchEventById(Number(id));
        setEvent(response.data);
      } catch (error) {
        message.error("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Spin
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      />
    );
  }

  if (!event) {
    return (
      <Text
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Event not found.
      </Text>
    );
  }

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ textAlign: "left" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </div>
      <Card style={{ marginBottom: "20px" }}>
        <Title style={{ textAlign: "center" }} level={2}>
          {event.name}
        </Title>
        {/* Center whole details block while keeping inner text left-aligned */}
        <div className="center-container">
          <div className="center-left-block">
            <div
              className="details-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "max-content max-content",
                columnGap: 250,
                rowGap: 8,
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <div>
                <Text>Date: {event.date}</Text>
              </div>
              <div>
                <Text>Time: {event.time}</Text>
              </div>
              <div>
                <Text>Location: {event.location}</Text>
              </div>
              <div>
                <Text>Max Players: {event.maxPlayers}</Text>
              </div>
            </div>
            <Text style={{ display: "block", marginTop: 10 }}>
              Description: {event.description}
            </Text>
            {/* Center the button relative to the details block width */}
            <div className="center-container" style={{ marginTop: 16 }}>
              <Button type="primary">Register</Button>
            </div>
          </div>
        </div>
      </Card>
      <Row gutter={[12, 16]} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Col xs={24} md={12}>
          <Card
            title={`Registered Players (${
              event.registeredPlayers?.length || 0
            }/${event.maxPlayers || 0})`}
            headStyle={{ textAlign: "center" }}
          >
            <div className="center-container">
              <div className="center-left-block">
                {event.registeredPlayers?.length > 0 ? (
                  event.registeredPlayers.map((player, index) => (
                    <Text key={index}>{player}</Text>
                  ))
                ) : (
                  <Text>No players registered yet.</Text>
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={`Waiting List (${event.waitingListPlayers?.length || 0})`}
            headStyle={{ textAlign: "center" }}
          >
            <div className="center-container">
              <div className="center-left-block">
                {event.waitingListPlayers?.length > 0 ? (
                  event.waitingListPlayers.map((player, index) => (
                    <Text key={index}>{player}</Text>
                  ))
                ) : (
                  <Text>No players on the waiting list.</Text>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventInfo;
