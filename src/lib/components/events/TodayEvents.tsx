import { ProcessedEvent } from "../../types";
import EventItem from "./EventItem";
import CSS from "../../assets/css/styles.module.css";
import { differenceInMinutes, setHours } from "date-fns";
import { traversCrossingEvents } from "../../helpers/generals";
import { BORDER_HEIGHT } from "../../helpers/constants";

interface TodayEventsProps {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  cellHeight: number;
  direction: string;
}
const TodayEvents = ({
  todayEvents,
  today,
  startHour,
  step,
  minuteHeight,
  cellHeight,
  direction,
}: TodayEventsProps) => {
  const crossingIds: Array<number | string> = [];
  return (
    <div className={CSS.events_col}>
      {todayEvents.map((event, i) => {
        const height =
          differenceInMinutes(event.end, event.start) * minuteHeight;
        const fromTop = differenceInMinutes(
          event.start,
          setHours(today, startHour)
        );
        /**
         * Count how many slots to count estimated total border height from top
         * The hardcoded BORDER_HEIGHT needs to be figured out dynamically
         */
        const slotsFromTop = fromTop / step;
        const borderFactor = slotsFromTop * BORDER_HEIGHT;
        const top = cellHeight * slotsFromTop + borderFactor;

        const crossingEvents = traversCrossingEvents(todayEvents, event);
        const alreadyRendered = crossingEvents.filter((e) =>
          crossingIds.includes(e.event_id)
        );
        crossingIds.push(event.event_id);

        return (
          <div
            key={event.event_id}
            className={CSS.event__item}
            style={{
              height: height,
              top: top,
              width: crossingEvents.length
                ? `${100 / (crossingEvents.length + 1) + 10}%`
                : "",
              [direction === "rtl" ? "right" : "left"]: alreadyRendered.length
                ? `${
                    alreadyRendered.length *
                    (100 / (alreadyRendered.length + 1.7))
                  }%`
                : "",
            }}
          >
            <EventItem event={event} />
          </div>
        );
      })}
    </div>
  );
};

export default TodayEvents;
