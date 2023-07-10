import { Fragment, useMemo } from "react";
import {
  closestTo,
  isBefore,
  startOfDay,
  endOfDay,
  isAfter,
  isWithinInterval,
  startOfWeek,
  differenceInDays,
  differenceInCalendarWeeks,
  addMinutes,
} from "date-fns";
import { ProcessedEvent } from "../../types";
import { Typography } from "@mui/material";
import EventItem from "./EventItem";
import { MONTH_NUMBER_HEIGHT, MULTI_DAY_EVENT_HEIGHT } from "../../helpers/constants";
import { convertEventTimeZone, differenceInDaysOmitTime } from "../../helpers/generals";
import useStore from "../../hooks/useStore";

interface MonthEventProps {
  events: ProcessedEvent[];
  today: Date;
  eachWeekStart: Date[];
  eachFirstDayInCalcRow: Date | null;
  daysList: Date[];
  onViewMore(day: Date): void;
  cellHeight: number;
}

const MonthEvents = ({
  events,
  today,
  eachWeekStart,
  eachFirstDayInCalcRow,
  daysList,
  onViewMore,
  cellHeight,
}: MonthEventProps) => {
  const LIMIT = Math.round((cellHeight - MONTH_NUMBER_HEIGHT) / MULTI_DAY_EVENT_HEIGHT - 1);
  const { translations, month, locale, timeZone } = useStore();

  const renderEvents = useMemo(() => {
    const elements: JSX.Element[] = [];
    for (let i = 0; i < Math.min(events.length, LIMIT + 1); i++) {
      const event = convertEventTimeZone(events[i], timeZone);
      const fromPrevWeek = !!eachFirstDayInCalcRow && isBefore(event.start, eachFirstDayInCalcRow);
      const start = fromPrevWeek && eachFirstDayInCalcRow ? eachFirstDayInCalcRow : event.start;
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
        const daysDiff = differenceInDaysOmitTime(e.start, e.end);
        const moreThanOneDay = daysDiff > 0;
        const isWithinToday =
          daysDiff === 0 &&
          (isWithinInterval(e.start, { start: startOfDay(today), end: endOfDay(today) }) ||
            isWithinInterval(e.end, { start: startOfDay(today), end: endOfDay(today) }));
        const isBeforeToday = isBefore(e.start, addMinutes(startOfDay(today), 1));
        const isAfterToday = isAfter(e.end, addMinutes(endOfDay(today), -1));
        const isBeforeAfter = isBeforeToday && isAfterToday;
        const isBeforeCrossToday = isBeforeToday && isWithinToday;
        const isAfterCrossToday = isAfterToday && isWithinToday;
        const isFromTodayOn = isWithinToday && moreThanOneDay;
        const shouldInclude =
          isBeforeAfter || isBeforeCrossToday || isAfterCrossToday || isFromTodayOn;
        return (
          !eachFirstDayInCalcRow && e.event_id !== event.event_id && LIMIT > i && shouldInclude
        );
      });

      let index = i;

      if (prevNextEvents.length) {
        index += prevNextEvents.length;
      }

      const topSpace = Math.min(index, LIMIT) * MULTI_DAY_EVENT_HEIGHT + MONTH_NUMBER_HEIGHT;

      if (index >= LIMIT) {
        elements.push(
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
            {`${Math.abs(events.length - i)} ${translations.moreEvents}`}
          </Typography>
        );
        break;
      }
      elements.push(
        <div
          key={`${event.event_id}_${i}`}
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
    }

    return elements;
  }, [
    events,
    timeZone,
    eachFirstDayInCalcRow,
    month?.weekStartOn,
    locale,
    LIMIT,
    eachWeekStart,
    daysList.length,
    today,
    translations.moreEvents,
    onViewMore,
  ]);

  return <Fragment>{renderEvents}</Fragment>;
};

export default MonthEvents;
