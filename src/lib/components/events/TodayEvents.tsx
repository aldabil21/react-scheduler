import { Fragment } from "react";
import { ProcessedEvent } from "../../types";
import EventItem from "./EventItem";
import { differenceInMinutes } from "date-fns";
import { isTimeZonedToday, traversCrossingEvents } from "../../helpers/generals";
import { BORDER_HEIGHT } from "../../helpers/constants";
import CurrentTimeBar from "./CurrentTimeBar";

interface TodayEventsProps {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  direction: "rtl" | "ltr";
  timeZone?: string;
}
const TodayEvents = ({
  todayEvents,
  today,
  startHour,
  step,
  minuteHeight,
  direction,
  timeZone,
}: TodayEventsProps) => {
  const crossingIds: Array<number | string> = [];

  return (
    <Fragment>
      {isTimeZonedToday({ dateLeft: today, timeZone }) && (
        <CurrentTimeBar
          startHour={startHour}
          step={step}
          minuteHeight={minuteHeight}
          timeZone={timeZone}
          zIndex={2 * todayEvents.length + 1}
        />
      )}

      {todayEvents.map((event, i) => {
        const height = differenceInMinutes(event.end, event.start) * minuteHeight - BORDER_HEIGHT;
        const minituesFromTop = Math.abs(startHour - event.start.getHours()) * 60;
        const topSpace = minituesFromTop * minuteHeight;
        /** Add border factor to height of each slot */
        const slots = height / 60;
        const heightBorderFactor = slots * BORDER_HEIGHT;

        /** Calculate top space */
        const slotsFromTop = minituesFromTop / step;
        const top = topSpace + slotsFromTop;

        const crossingEvents = traversCrossingEvents(todayEvents, event);
        const alreadyRendered = crossingEvents.filter((e) => crossingIds.includes(e.event_id));
        crossingIds.push(event.event_id);

        return (
          <div
            key={event.event_id}
            className="rs__event__item"
            style={{
              height: height + heightBorderFactor,
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
