import { Fragment, useMemo } from "react";
import {
  closestTo,
  isBefore,
  startOfDay,
  endOfDay,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  differenceInDays,
  differenceInCalendarWeeks,
} from "date-fns";
import { ProcessedEvent } from "../../types";
import { Typography } from "@mui/material";
import EventItem from "./EventItem";
import { MONTH_NUMBER_HEIGHT, MULTI_DAY_EVENT_HEIGHT } from "../../helpers/constants";
import { convertEventTimeZone, differenceInDaysOmitTime } from "../../helpers/generals";
import { useStore } from "../../store";

interface MonthEventProps {
  events: ProcessedEvent[];
  today: Date;
  eachWeekStart: Date[];
  daysList: Date[];
  onViewMore(day: Date): void;
  cellHeight: number;
}

const MonthEvents = ({
  events,
  today,
  eachWeekStart,
  daysList,
  onViewMore,
  cellHeight,
}: MonthEventProps) => {
  const LIMIT = Math.round((cellHeight - MONTH_NUMBER_HEIGHT) / MULTI_DAY_EVENT_HEIGHT - 1);
  const { translations, month, locale, timeZone } = useStore();
  const eachFirstDayInCalcRow = eachWeekStart.some((date) => isSameDay(date, today)) ? today : null;

  const todayEvents = useMemo(() => {
    const list: ProcessedEvent[] = [];
    for (let i = 0; i < events.length; i++) {
      const event = convertEventTimeZone(events[i], timeZone);
      if (
        (eachFirstDayInCalcRow &&
          isWithinInterval(eachFirstDayInCalcRow, {
            start: startOfDay(event.start),
            end: endOfDay(event.end),
          })) ||
        isSameDay(event.start, today)
      ) {
        list.push(event);
      }
    }
    return list.sort((a, b) => b.end.getTime() - a.end.getTime());
  }, [eachFirstDayInCalcRow, events, today, timeZone]);

  return (
    <Fragment>
      {todayEvents.map((event, i) => {
        const fromPrevWeek =
          !!eachFirstDayInCalcRow && isBefore(event.start, eachFirstDayInCalcRow);
        const start = fromPrevWeek && eachFirstDayInCalcRow ? eachFirstDayInCalcRow : event.start;
        //&& isBefore(eachFirstDayInCalcRow, event.end)
        let eventLength = differenceInDaysOmitTime(start, event.end) + 1;

        const toNextWeek =
          differenceInCalendarWeeks(event.end, start, {
            weekStartsOn: month?.weekStartOn,
            locale,
          }) > 0;

        if (toNextWeek) {
          // Rethink it
          const NotAccurateWeekStart = startOfWeek(event.start);
          const closestStart = closestTo(NotAccurateWeekStart, eachWeekStart);
          if (closestStart) {
            eventLength =
              daysList.length -
              (!eachFirstDayInCalcRow ? differenceInDays(event.start, closestStart) : 0);
          }
        }

        const prevNextEvents = events.filter((e) => {
          return (
            !eachFirstDayInCalcRow &&
            e.event_id !== event.event_id &&
            LIMIT > i &&
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
        const topSpace = index * MULTI_DAY_EVENT_HEIGHT + MONTH_NUMBER_HEIGHT;

        return index > LIMIT ? (
          ""
        ) : index === LIMIT ? (
          <Typography
            key={i}
            width="100%"
            className="rs__multi_day rs__hover__op"
            style={{ top: topSpace, fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event.start);
            }}
          >
            {`${Math.abs(todayEvents.length - i)} ${translations.moreEvents}`}
          </Typography>
        ) : (
          <div
            key={event.event_id}
            className="rs__multi_day"
            style={{
              top: topSpace,
              width: `${100 * eventLength}%`,
            }}
          >
            <EventItem
              event={event}
              showdate={false}
              multiday={differenceInDaysOmitTime(event.start, event.end) > 0}
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
