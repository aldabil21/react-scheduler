import { Fragment, useCallback, useEffect, useState } from "react";
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
  addMinutes,
} from "date-fns";
import { ProcessedEvent } from "../../types";
import { Typography } from "@mui/material";
import EventItem from "./EventItem";
import { MONTH_NUMBER_HEIGHT, MULTI_DAY_EVENT_HEIGHT } from "../../helpers/constants";
import {
  convertEventTimeZone,
  differenceInDaysOmitTime,
  sortEventsByTheLengthest,
} from "../../helpers/generals";
import useStore from "../../hooks/useStore";

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
  const [monthsEvent, setMonthsEvent] = useState<JSX.Element | JSX.Element[]>(<></>);
  const LIMIT = Math.round((cellHeight - MONTH_NUMBER_HEIGHT) / MULTI_DAY_EVENT_HEIGHT - 1);
  const { translations, month, locale, timeZone, triggerLoading } = useStore();
  const eachFirstDayInCalcRow = eachWeekStart.some((date) => isSameDay(date, today)) ? today : null;

  const todayEvents = useCallback(() => {
    // refactor above code to use new Promise and return Promise of list
    return new Promise<ProcessedEvent[]>((resolve) => {
      setTimeout(() => {
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

        // Sort by the length est event
        resolve(sortEventsByTheLengthest(list));
      }, 0);
    });
  }, [eachFirstDayInCalcRow, events, today, timeZone]);

  const renderEvents = useCallback(
    async (todayEvents: ProcessedEvent[]) => {
      return new Promise<JSX.Element[]>((resolve) => {
        setTimeout(() => {
          const elements: JSX.Element[] = [];
          for (let i = 0; i < Math.min(todayEvents.length, LIMIT + 1); i++) {
            const event = todayEvents[i];
            const fromPrevWeek =
              !!eachFirstDayInCalcRow && isBefore(event.start, eachFirstDayInCalcRow);
            const start =
              fromPrevWeek && eachFirstDayInCalcRow ? eachFirstDayInCalcRow : event.start;
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
                !eachFirstDayInCalcRow &&
                e.event_id !== event.event_id &&
                LIMIT > i &&
                shouldInclude
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
                  {`${Math.abs(todayEvents.length - i)} ${translations.moreEvents}`}
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

          resolve(elements);
        }, 0);
      });
    },
    [
      events,
      LIMIT,
      daysList.length,
      eachFirstDayInCalcRow,
      eachWeekStart,
      locale,
      month?.weekStartOn,
      onViewMore,
      today,
      translations.moreEvents,
    ]
  );

  const runAyncRender = useCallback(async () => {
    try {
      triggerLoading(true);
      const events = await todayEvents();
      const renderedEvents = await renderEvents(events);
      setMonthsEvent(renderedEvents);
    } finally {
      triggerLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    runAyncRender();
  }, [runAyncRender]);

  return <Fragment>{monthsEvent}</Fragment>;
};

export default MonthEvents;
