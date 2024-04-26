import { useEffect, useCallback, Fragment } from "react";
import { Typography } from "@mui/material";
import {
  format,
  eachMinuteOfInterval,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  addDays,
  addMinutes,
  set,
} from "date-fns";
import TodayTypo from "../components/common/TodayTypo";
import EventItem from "../components/events/EventItem";
import { CellRenderedProps, DayHours, DefaultRecourse, ProcessedEvent } from "../types";
import {
  calcCellHeight,
  calcMinuteHeight,
  filterMultiDaySlot,
  filterTodayEvents,
  getHourFormat,
  getResourcedEvents,
} from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import Cell from "../components/common/Cell";
import TodayEvents from "../components/events/TodayEvents";
import { TableGrid } from "../styles/styles";
import { MULTI_DAY_EVENT_HEIGHT } from "../helpers/constants";
import useStore from "../hooks/useStore";
import { DayAgenda } from "./DayAgenda";

export interface DayProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  hourRenderer?(hour: string): JSX.Element;
  navigation?: boolean;
}

const Day = () => {
  const {
    day,
    selectedDate,
    events,
    height,
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
    stickyNavigation,
    agenda,
  } = useStore();

  const { startHour, endHour, step, cellRenderer, headRenderer, hourRenderer } = day!;
  const START_TIME = set(selectedDate, { hours: startHour, minutes: 0, seconds: 0 });
  const END_TIME = set(selectedDate, { hours: endHour, minutes: -step, seconds: 0 });
  const hours = eachMinuteOfInterval(
    {
      start: START_TIME,
      end: END_TIME,
    },
    { step: step }
  );
  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const hFormat = getHourFormat(hourFormat);

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const start = addDays(START_TIME, -1);
      const end = addDays(END_TIME, 1);
      const events = await getRemoteEvents!({
        start,
        end,
        view: "day",
      });
      if (events && events?.length) {
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

  const renderMultiDayEvents = (events: ProcessedEvent[]) => {
    const todayMulti = filterMultiDaySlot(events, selectedDate, timeZone);
    return (
      <div className="rs__block_col" style={{ height: MULTI_DAY_EVENT_HEIGHT * todayMulti.length }}>
        {todayMulti.map((event, i) => {
          const hasPrev = isBefore(event.start, startOfDay(selectedDate));
          const hasNext = isAfter(event.end, endOfDay(selectedDate));
          return (
            <div
              key={event.event_id}
              className="rs__multi_day"
              style={{
                top: i * MULTI_DAY_EVENT_HEIGHT,
                width: "99.9%",
                overflowX: "hidden",
              }}
            >
              <EventItem event={event} multiday hasPrev={hasPrev} hasNext={hasNext} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let resourcedEvents = events;
    if (resource) {
      resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }

    if (agenda) {
      return <DayAgenda events={resourcedEvents} />;
    }

    // Equalizing multi-day section height
    const shouldEqualize = resources.length && resourceViewMode === "default";
    const allWeekMulti = filterMultiDaySlot(
      shouldEqualize ? events : resourcedEvents,
      selectedDate,
      timeZone
    );
    const headerHeight = MULTI_DAY_EVENT_HEIGHT * allWeekMulti.length + 45;
    return (
      <>
        {/* Header */}
        <TableGrid days={1} sticky="1" stickyNavigation={stickyNavigation}>
          <span className="rs__cell"></span>
          <span
            className={`rs__cell rs__header ${isToday(selectedDate) ? "rs__today_cell" : ""}`}
            style={{ height: headerHeight }}
          >
            {typeof headRenderer === "function" ? (
              <div>{headRenderer(selectedDate)}</div>
            ) : (
              <TodayTypo date={selectedDate} locale={locale} />
            )}
            {renderMultiDayEvents(resourcedEvents)}
          </span>
        </TableGrid>
        <TableGrid days={1}>
          {/* Body */}
          {hours.map((h, i) => {
            const start = new Date(`${format(selectedDate, "yyyy/MM/dd")} ${format(h, hFormat)}`);
            const end = addMinutes(start, step);
            const field = resourceFields.idField;
            return (
              <Fragment key={i}>
                {/* Time Cells */}
                <span className="rs__cell rs__header rs__time" style={{ height: CELL_HEIGHT }}>
                  {typeof hourRenderer === "function" ? (
                    <div>{hourRenderer(format(h, hFormat, { locale }))}</div>
                  ) : (
                    <Typography variant="caption">{format(h, hFormat, { locale })}</Typography>
                  )}
                </span>
                <span className={`rs__cell ${isToday(selectedDate) ? "rs__today_cell" : ""}`}>
                  {/* Events of this day - run once on the top hour column */}
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={filterTodayEvents(resourcedEvents, selectedDate, timeZone)}
                      today={START_TIME}
                      minuteHeight={MINUTE_HEIGHT}
                      startHour={startHour}
                      endHour={endHour}
                      step={step}
                      direction={direction}
                      timeZone={timeZone}
                    />
                  )}
                  {/* Cell */}
                  <Cell
                    start={start}
                    end={end}
                    day={selectedDate}
                    height={CELL_HEIGHT}
                    resourceKey={field}
                    resourceVal={resource ? resource[field] : null}
                    cellRenderer={cellRenderer}
                  />
                </span>
              </Fragment>
            );
          })}
        </TableGrid>
      </>
    );
  };

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Day };
