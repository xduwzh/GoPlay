import React from "react";
import { List, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

// Event item type definition
interface EventItem {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
}

const EventList: React.FC<{ events: EventItem[] }> = ({ events }) => {
  const navigate = useNavigate();

  // Format date as 'MM-DD HH:mm'
  const formatDate = (date: string, time: string) => {
    const d = new Date(`${date}T${time}`);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${month}-${day} ${hour}:${minute}`;
  };

  // Navigate to event detail page
  const goToDetail = (id: number) => {
    navigate(`/event/${id}`);
  };

  return (
    <Card
      title="Event List"
      style={{
        minWidth: 350,
        width: "100%",
        height: 420,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List
        dataSource={events}
        style={{
          flex: 1,
          minHeight: 0,
          padding: 24,
          display: "flex",
          flexDirection: "column",
        }}
        pagination={{ pageSize: 3, position: "bottom" }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                type="link"
                onClick={() => goToDetail(item.id)}
                key="detail"
              >
                Event Detail
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <span
                  style={{ cursor: "pointer", color: "#1677ff" }}
                  onClick={() => goToDetail(item.id)}
                >
                  {item.name}
                </span>
              }
              description={
                <>
                  <div>Date: {formatDate(item.date, item.time)}</div>
                  <div>Location: {item.location}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default EventList;
