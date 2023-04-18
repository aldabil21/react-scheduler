import { useEffect, useCallback, Fragment } from "react";
import { Typography } from "@mui/material";
import {
  startOfWeek,
  addDays,
  format,
  eachMinuteOfInterval,
  isSameDay,
  isBefore,
  isToday,
  setMinutes,
  setHours,
  isWithinInterval,
  isAfter,
  endOfDay,
  startOfDay,
  addMinutes,
} from "date-fns";
import TodayTypo from "../components/common/TodayTypo";
import EventItem from "../components/events/EventItem";
import { CellRenderedProps, DayHours, DefaultRecourse, ProcessedEvent } from "../types";
import { WeekDays } from "./Month";
import {
  calcCellHeight,
  calcMinuteHeight,
  differenceInDaysOmitTime,
  filterMultiDaySlot,
  filterTodayEvents,
  getResourcedEvents,
  getTimeZonedDate,
} from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import Cell from "../components/common/Cell";
import TodayEvents from "../components/events/TodayEvents";
import { TableGrid } from "../styles/styles";
import { MULTI_DAY_EVENT_HEIGHT } from "../helpers/constants";
import useSyncScroll from "../hooks/useSyncScroll";
import useStore from "../hooks/useStore";

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

const Week = () => {
  const {
    week,
    selectedDate,
    height,
    events,
    handleGotoDay,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    resourceViewMode,
    fields,
    direction,
    locale,
    hourFormat,
    timeZone,
  } = useStore();

  const {
    weekStartOn,
    weekDays,
    startHour,
    endHour,
    step,
    cellRenderer,
    disableGoToDay,
    headRenderer,
  } = week!;
  const _weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const daysList = weekDays.map((d) => addDays(_weekStart, d));
  const weekStart = startOfDay(daysList[0]);
  const weekEnd = endOfDay(daysList[daysList.length - 1]);
  const START_TIME = setMinutes(setHours(selectedDate, startHour), 0);
  const END_TIME = setMinutes(setHours(selectedDate, endHour), 0);
  const hours = eachMinuteOfInterval(
    {
      start: START_TIME,
      end: END_TIME,
    },
    { step: step }
  );
  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const MULTI_SPACE = MULTI_DAY_EVENT_HEIGHT;
  const hFormat = hourFormat === "12" ? "hh:mm a" : "HH:mm";
  const { headersRef, bodyRef } = useSyncScroll();

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);

      const events = await getRemoteEvents!({
        start: weekStart,
        end: weekEnd,
        view: "week",
      });
      if (Array.isArray(events)) {
        handleState(events, "events");
      }
    } catch (error) {
      throw error;
    } finally {
      triggerLoading(false);
    }
    // eslint-disable-next-line
  }, [selectedDate, getRemoteEvents]);

  useEffect(() => {
    if (getRemoteEvents instanceof Function) {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderMultiDayEvents = (events: ProcessedEvent[], today: Date) => {
    const isFirstDayInWeek = isSameDay(weekStart, today);
    const allWeekMulti = filterMultiDaySlot(events, daysList, timeZone);

    const multiDays = allWeekMulti
      .filter((e) => (isBefore(e.start, weekStart) ? isFirstDayInWeek : isSameDay(e.start, today)))
      .sort((a, b) => b.end.getTime() - a.end.getTime());
    return multiDays.map((event, i) => {
      const hasPrev = isBefore(startOfDay(event.start), weekStart);
      const hasNext = isAfter(endOfDay(event.end), weekEnd);
      const eventLength =
        differenceInDaysOmitTime(hasPrev ? weekStart : event.start, hasNext ? weekEnd : event.end) +
        1;
      const prevNextEvents = events.filter((e) =>
        isFirstDayInWeek
          ? false
          : e.event_id !== event.event_id && //Exclude it's self
            isWithinInterval(today, {
              start: getTimeZonedDate(e.start, timeZone),
              end: getTimeZonedDate(e.end, timeZone),
            })
      );

      let index = i;
      if (prevNextEvents.length) {
        index += prevNextEvents.length;
      }

      return (
        <div
          key={event.event_id}
          className="rs__multi_day"
          style={{
            top: index * MULTI_SPACE + 45,
            width: `${99.9 * eventLength}%`,
            overflowX: "hidden",
          }}
        >
          <EventItem event={event} hasPrev={hasPrev} hasNext={hasNext} multiday />
        </div>
      );
    });
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }

    // Equalizing multi-day section height except in resource/tabs mode
    const shouldEqualize = resources.length && resourceViewMode !== "tabs";
    const allWeekMulti = filterMultiDaySlot(
      shouldEqualize ? events : recousedEvents,
      daysList,
      timeZone
    );
    const headerHeight = MULTI_SPACE * allWeekMulti.length + 45;
    return (
      <>
        {/* Header days */}
        <TableGrid days={daysList.length} ref={headersRef} sticky="1">
          <span className="rs__cell rs__time"></span>
          {daysList.map((date, i) => (
            <span
              key={i}
              className={`rs__cell rs__header ${isToday(date) ? "rs__today_cell" : ""}`}
              style={{ height: headerHeight }}
            >
              {typeof headRenderer === "function" ? (
                <div>{headRenderer(date)}</div>
              ) : (
                <TodayTypo
                  date={date}
                  onClick={!disableGoToDay ? handleGotoDay : undefined}
                  locale={locale}
                />
              )}
              {renderMultiDayEvents(recousedEvents, date)}
            </span>
          ))}
        </TableGrid>
        {/* Time Cells */}
        <TableGrid days={daysList.length} ref={bodyRef}>
          {hours.map((h, i) => (
            <Fragment key={i}>
              <span style={{ height: CELL_HEIGHT }} className="rs__cell rs__header rs__time">
                <Typography variant="caption">{format(h, hFormat, { locale })}</Typography>
              </span>
              {daysList.map((date, ii) => {
                const start = new Date(`${format(date, "yyyy/MM/dd")} ${format(h, hFormat)}`);
                const end = new Date(
                  `${format(date, "yyyy/MM/dd")} ${format(addMinutes(h, step), hFormat)}`
                );
                const field = resourceFields.idField;
                return (
                  <span key={ii} className={`rs__cell ${isToday(date) ? "rs__today_cell" : ""}`}>
                    {/* Events of each day - run once on the top hour column */}
                    {i === 0 && (
                      <TodayEvents
                        todayEvents={filterTodayEvents(recousedEvents, date, timeZone)}
                        today={date}
                        minuteHeight={MINUTE_HEIGHT}
                        startHour={startHour}
                        step={step}
                        direction={direction}
                        timeZone={timeZone}
                      />
                    )}
                    <Cell
                      start={start}
                      end={end}
                      day={date}
                      height={CELL_HEIGHT}
                      resourceKey={field}
                      resourceVal={resource ? resource[field] : null}
                      cellRenderer={cellRenderer}
                    />
                  </span>
                );
              })}
            </Fragment>
          ))}
        </TableGrid>
      </>
    );
  };

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Week };
