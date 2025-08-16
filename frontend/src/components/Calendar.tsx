import React from "react";
import { Calendar as AntdCalendar, Button } from "antd";
import dayjs from "dayjs";

interface EventItem {
  id: number;
  name: string;
  date: string; // yyyy-mm-dd
  time?: string;
  location?: string;
}

interface CalendarProps {
  events: EventItem[];
  onDateSelect?: (date: string | null) => void;
  selectedDate?: string | null;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateSelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = React.useState(dayjs());

  const fullCellRender = (current: any, info: any) => {
    if (info.type !== "date") return info.originNode;

    const dateStr = current.format("YYYY-MM-DD");
    const hasEvent = events.some((e) => e.date === dateStr);
    const isSelected = selectedDate === dateStr;

    const textColor = isSelected ? "#52c41a" : hasEvent ? "#1677ff" : "#bfbfbf"; // grey when no events
    const dotColor = isSelected ? "#52c41a" : "#1677ff";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            color: textColor,
            fontWeight: isSelected ? "bold" : "normal",
          }}
        >
          {current.date()}
        </div>
        {hasEvent ? (
          <span
            style={{
              width: 6,
              height: 6,
              backgroundColor: dotColor,
              borderRadius: "50%",
              display: "inline-block",
              marginTop: 4,
            }}
          />
        ) : null}
      </div>
    );
  };

  const disabledDate = (current: any) => {
    const dateStr = current.format("YYYY-MM-DD");
    return !events.some((e) => e.date === dateStr);
  };

  const headerRender = ({ value, onChange }: any) => {
    const goPrev = () => {
      const next = value.subtract(1, "month");
      onChange?.(next);
      setCurrentDate(next);
    };
    const goNext = () => {
      const next = value.add(1, "month");
      onChange?.(next);
      setCurrentDate(next);
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Button onClick={goPrev}>←</Button>
        <span style={{ fontWeight: "bold" }}>{value.format("YYYY MMMM")}</span>
        <Button onClick={goNext}>→</Button>
      </div>
    );
  };

  return (
    <AntdCalendar
      fullscreen={false}
      style={{ width: 350 }}
      fullCellRender={fullCellRender}
      disabledDate={disabledDate}
      headerRender={headerRender}
      value={currentDate}
      onSelect={(date: any, info: any) => {
        // Only handle explicit date clicks, ignore selects from panel navigation
        if (info?.source !== "date") return;
        const dateStr = date.format("YYYY-MM-DD");
        if (events.some((e) => e.date === dateStr)) {
          onDateSelect?.(selectedDate === dateStr ? null : dateStr);
        }
      }}
      onPanelChange={(date) => setCurrentDate(date)}
    />
  );
};

export default Calendar;
