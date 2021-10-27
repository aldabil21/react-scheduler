import { Fragment } from "react";
import {
  closestTo,
  differenceInDays,
  isBefore,
  startOfDay,
  endOfDay,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfWeek,
} from "date-fns";
import { ProcessedEvent } from "../../types";
import { Typography } from "@mui/material";
import EventItem from "./EventItem";
import CSS from "../../assets/css/styles.module.css";

interface MonthEventProps {
  events: ProcessedEvent[];
  today: Date;
  eachWeekStart: Date[];
  daysList: Date[];
  onViewMore(day: Date): void;
}

const LIMIT = 3;
const SPACE = 25;
const MonthEvents = ({
  events,
  today,
  eachWeekStart,
  daysList,
  onViewMore,
}: MonthEventProps) => {
  const eachFirstDayInCalcRow = eachWeekStart.some((date) =>
    isSameDay(date, today)
  )
    ? today
    : null;

  const todayEvents = events
    .filter((e) =>
      eachFirstDayInCalcRow &&
      isWithinInterval(eachFirstDayInCalcRow, {
        start: startOfDay(e.start),
        end: endOfDay(e.end),
      })
        ? true
        : isSameDay(e.start, today)
    )
    .sort((a, b) => b.end.getTime() - a.end.getTime());

  return (
    <Fragment>
      {todayEvents.map((event, i) => {
        const fromPrevWeek =
          !!eachFirstDayInCalcRow &&
          isBefore(event.start, eachFirstDayInCalcRow);
        const start =
          fromPrevWeek && eachFirstDayInCalcRow
            ? eachFirstDayInCalcRow
            : event.start;

        let eventLength = differenceInDays(event.end, start) + 1;
        const toNextWeek = eventLength >= daysList.length;
        if (toNextWeek) {
          const NotAccurateWeekStart = startOfWeek(event.start);
          const closestStart = closestTo(NotAccurateWeekStart, eachWeekStart);
          eventLength =
            daysList.length -
            (!eachFirstDayInCalcRow
              ? differenceInDays(event.start, closestStart)
              : 0);
        }

        const prevNextEvents = events.filter((e) => {
          return (
            !eachFirstDayInCalcRow &&
            e.event_id !== event.event_id &&
            isBefore(e.start, startOfDay(today)) &&
            isAfter(e.end, startOfDay(today))
          );
        });
        let index = i;
        if (prevNextEvents.length) {
          index += prevNextEvents.length;
          // if (index > LIMIT) {
          //   index = LIMIT;
          // }
        }

        return index > LIMIT ? (
          ""
        ) : index === LIMIT ? (
          <Typography
            key={i}
            className={`${CSS.event__item} ${CSS.day_clickable}`}
            style={{ top: index * SPACE, fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event.start);
            }}
          >
            {`${Math.abs(todayEvents.length - i)} More...`}
          </Typography>
        ) : (
          <div
            key={i}
            className={CSS.event__item}
            style={{
              top: index * SPACE,
              width: `${100 * eventLength}%`,
            }}
          >
            <EventItem
              event={event}
              showdate={false}
              multiday={differenceInDays(event.end, event.start) > 0}
              hasPrev={fromPrevWeek}
              hasNext={toNextWeek}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default MonthEvents;
