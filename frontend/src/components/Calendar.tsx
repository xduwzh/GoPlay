import React from "react";
import { Calendar as AntdCalendar } from "antd";
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

  return (
    <AntdCalendar
      fullscreen={false}
      style={{ width: 350 }}
      fullCellRender={fullCellRender}
      disabledDate={disabledDate}
      value={selectedDate ? dayjs(selectedDate) : undefined}
      onSelect={(date) => {
        const dateStr = date.format("YYYY-MM-DD");
        if (onDateSelect) {
          onDateSelect(selectedDate === dateStr ? null : dateStr);
        }
      }}
    />
  );
};

export default Calendar;
