import { Fragment, useEffect, useState } from "react";
import { differenceInMinutes, setHours } from "date-fns";
import { BORDER_HEIGHT } from "../../helpers/constants";

interface CurrentTimeBarProps {
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  color?: string;
}

function calculateTop({ today, startHour, step, minuteHeight }: CurrentTimeBarProps): number {
  const now = new Date();

  const minutesFromTop = differenceInMinutes(now, setHours(today, startHour));
  const topSpace = minutesFromTop * minuteHeight;
  const slotsFromTop = minutesFromTop / step;
  const borderFactor = slotsFromTop + BORDER_HEIGHT;
  const top = topSpace + borderFactor;

  return top;
}

const CurrentTimeBar = (props: CurrentTimeBarProps) => {
  const [top, setTop] = useState(calculateTop(props));
  const color = props.color || "red";

  useEffect(() => {
    const interval = setInterval(() => setTop(calculateTop(props)), 60 * 1000);
    return () => clearInterval(interval);
  });

  return (
    <Fragment>
      <div
        style={{
          position: "absolute",
          height: "12px",
          width: "12px",
          borderRadius: "50%",
          background: color,
          marginLeft: "-6px",
          marginTop: "-5px",
          zIndex: 500,
          top: top,
        }}
      />
      <div
        style={{
          borderTop: `solid 2px ${color}`,
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 500,
          top: top,
        }}
      />
    </Fragment>
  );
};

export default CurrentTimeBar;
