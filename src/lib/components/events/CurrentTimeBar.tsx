import { Fragment, useEffect, useState } from "react";
import { differenceInMinutes, setHours } from "date-fns";
import { BORDER_HEIGHT } from "../../helpers/constants";
import { getTimeZonedDate } from "../../helpers/generals";
import { TimeIndicatorBar } from "../../styles/styles";

interface CurrentTimeBarProps {
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  timeZone?: string;
  color?: string;
}

function calculateTop({
  today,
  startHour,
  step,
  minuteHeight,
  timeZone,
}: CurrentTimeBarProps): number {
  const now = getTimeZonedDate(new Date(), timeZone);

  const minutesFromTop = differenceInMinutes(now, setHours(today, startHour));
  const topSpace = minutesFromTop * minuteHeight;
  const slotsFromTop = minutesFromTop / step;
  const borderFactor = slotsFromTop + BORDER_HEIGHT;
  const top = topSpace + borderFactor;

  return top;
}

const CurrentTimeBar = (props: CurrentTimeBarProps) => {
  const [top, setTop] = useState(calculateTop(props));

  useEffect(() => {
    const interval = setInterval(() => setTop(calculateTop(props)), 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Prevent showing bar on top of days/header
  if (top < 0) return null;

  return (
    <Fragment>
      <TimeIndicatorBar style={{ top }}>
        <div />
        <div />
      </TimeIndicatorBar>
    </Fragment>
  );
};

export default CurrentTimeBar;
