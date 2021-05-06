import { Fragment } from "react";
import { closestTo, differenceInDays, isBefore, startOfDay } from "date-fns";
import {
  endOfDay,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfWeek,
} from "date-fns/esm";
import { ProcessedEvent } from "../../Scheduler";
import { Paper, Typography, useTheme } from "@material-ui/core";
import EventItem from "./EventItem";

interface MonthEventProps {
  events: ProcessedEvent[];
  today: Date;
  eachWeekStart: Date[];
  daysList: Date[];
  onViewMore(day: Date): void;
  color?: string;
}

const LIMIT = 3;
const SPACE = 25;
const MonthEvents = ({
  events,
  today,
  eachWeekStart,
  daysList,
  onViewMore,
  color,
}: MonthEventProps) => {
  const theme = useTheme();

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
        const toNextWeek = eventLength > daysList.length;
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
            className="event__item day_clickable"
            style={{ top: index * SPACE, fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event.start);
            }}
          >
            {`${Math.abs(todayEvents.length - i)} More...`}
          </Typography>
        ) : (
          <Paper
            key={i}
            className="event__item"
            style={{
              top: index * SPACE,
              width: `${100 * eventLength}%`,
              background: event.color || theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <EventItem
              event={event}
              showdate={false}
              multiday={differenceInDays(event.end, event.start) > 0}
              hasPrev={fromPrevWeek}
              hasNext={toNextWeek}
            />
          </Paper>
        );
      })}
    </Fragment>
  );
};

export default MonthEvents;
