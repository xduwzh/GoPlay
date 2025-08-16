import React, { useEffect, useState } from "react";
import EventList from "../components/EventList";
import Calendar from "../components/Calendar";
import { fetchEvents } from "../apis/event";
import { Spin, message } from "antd";

const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchEvents()
      .then((res) => setEvents(res.data))
      .catch(() => message.error("Failed to fetch events"))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : events;

  const handleDateSelect = (date: string | null) => {
    setSelectedDate((prevDate) => (prevDate === date ? null : date));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 32,
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: 500,
        padding: 24,
      }}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <div style={{ flex: 1, maxWidth: 400 }}>
            <EventList events={filteredEvents} />
          </div>
          <div style={{ flex: 1, maxWidth: 400 }}>
            <Calendar
              events={events}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate as string | null}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
