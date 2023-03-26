import { ProcessedEvent } from "../../types";
import EventItem from "./EventItem";
import { differenceInMinutes, setHours, isToday } from "date-fns";
import { traversCrossingEvents } from "../../helpers/generals";
import { BORDER_HEIGHT } from "../../helpers/constants";
import { Fragment, useMemo } from "react";
import CurrentTimeBar from "./CurrentTimeBar";

interface TodayEventsProps {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  direction: "rtl" | "ltr";
}
const TodayEvents = ({
  todayEvents,
  today,
  startHour,
  step,
  minuteHeight,
  direction,
}: TodayEventsProps) => {
  const crossingIds: Array<number | string> = [];

  // Sort events by latest end time
  const sortedEvents = useMemo(() => {
    return todayEvents.sort((a, b) => {
      const aDiff = a.end.getTime() - a.start.getTime();
      const bDiff = b.end.getTime() - b.start.getTime();
      return bDiff - aDiff;
    });
  }, [todayEvents]);

  return (
    <Fragment>
      {isToday(today) && (
        <CurrentTimeBar
          today={today}
          startHour={startHour}
          step={step}
          minuteHeight={minuteHeight}
        />
      )}

      {sortedEvents.map((event, i) => {
        const height = differenceInMinutes(event.end, event.start) * minuteHeight;
        const minituesFromTop = differenceInMinutes(event.start, setHours(today, startHour));
        const topSpace = minituesFromTop * minuteHeight; //+ headerHeight;
        /**
         * Add border height since grid has a 1px border
         */
        const slotsFromTop = minituesFromTop / step;

        const borderFactor = slotsFromTop + BORDER_HEIGHT;
        const top = topSpace + borderFactor;

        if (top < 0) {
          return null;
        }

        const crossingEvents = traversCrossingEvents(todayEvents, event);
        const alreadyRendered = crossingEvents.filter((e) => crossingIds.includes(e.event_id));
        crossingIds.push(event.event_id);

        return (
          <div
            key={event.event_id}
            className="rs__event__item"
            style={{
              height,
              top,
              width:
                alreadyRendered.length > 0
                  ? `calc(100% - ${100 - 98 / (alreadyRendered.length + 1)}%)`
                  : "98%", // Leave some space to click cell
              zIndex: todayEvents.length + i,
              [direction === "rtl" ? "right" : "left"]:
                alreadyRendered.length > 0
                  ? `${(100 / (crossingEvents.length + 1)) * alreadyRendered.length}%`
                  : "",
            }}
          >
            <EventItem event={event} />
          </div>
        );
      })}
    </Fragment>
  );
};

export default TodayEvents;
