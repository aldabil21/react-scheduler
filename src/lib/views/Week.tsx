import { useEffect, useCallback, Fragment } from "react";
import { ButtonBase, Typography } from "@material-ui/core";
import {
  startOfWeek,
  addDays,
  format,
  eachMinuteOfInterval,
  addHours,
  isSameDay,
  differenceInMinutes,
  differenceInDays,
  isBefore,
  isToday,
  setMinutes,
  setHours,
  isWithinInterval,
  isAfter,
  addMinutes,
  endOfDay,
  startOfDay,
} from "date-fns";
import TodayTypo from "../components/common/TodayTypo";
import EventItem from "../components/events/EventItem";
import { useAppState } from "../hooks/useAppState";
import {
  CellRenderedProps,
  DayHours,
  DefaultRecourse,
  ProcessedEvent,
} from "../Scheduler";
import { WeekDays } from "./Month";
import { getResourcedEvents } from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
}

const Week = () => {
  const {
    week,
    selectedDate,
    height,
    events,
    triggerDialog,
    handleGotoDay,
    remoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    direction,
    locale,
  } = useAppState();

  const { weekStartOn, weekDays, startHour, endHour, step, cellRenderer } =
    week!;
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
  const CELL_HEIGHT = height / hours.length;
  const MINUTE_HEIGHT = (Math.ceil(CELL_HEIGHT) * 1.042) / step;

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const query = `?start=${weekStart}&end=${weekEnd}`;
      const events = await remoteEvents!(query);
      if (Array.isArray(events)) {
        handleState(events, "events");
      }
    } catch (error) {
      throw error;
    } finally {
      triggerLoading(false);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  useEffect(() => {
    if (remoteEvents instanceof Function) {
      fetchEvents();
    }
    // eslint-disable-next-line
  }, [fetchEvents]);

  const renderMultiDayEvents = (events: ProcessedEvent[], today: Date) => {
    const SPACE = 28;
    const isFirstDayInWeek = isSameDay(weekStart, today);
    const allWeekMulti = events.filter(
      (e) =>
        differenceInDays(e.end, e.start) > 0 &&
        daysList.some((weekday) =>
          isWithinInterval(weekday, {
            start: startOfDay(e.start),
            end: endOfDay(e.end),
          })
        )
    );

    const multiDays = allWeekMulti
      .filter((e) =>
        isBefore(e.start, weekStart)
          ? isFirstDayInWeek
          : isSameDay(e.start, today)
      )
      .sort((a, b) => b.end.getTime() - a.end.getTime());
    return (
      <div
        className="events_col"
        style={{ height: SPACE * allWeekMulti.length }}
      >
        {multiDays.map((event, i) => {
          const hasPrev = isBefore(startOfDay(event.start), weekStart);
          const hasNext = isAfter(endOfDay(event.end), weekEnd);
          const eventLength =
            differenceInDays(
              hasNext ? weekEnd : event.end,
              hasPrev ? weekStart : event.start
            ) + 1;
          const prevNextEvents = events.filter((e) =>
            isFirstDayInWeek
              ? false
              : e.event_id !== event.event_id && //Exclude it's self
                isWithinInterval(today, { start: e.start, end: e.end })
          );

          let index = i;
          if (prevNextEvents.length) {
            index += prevNextEvents.length;
          }

          return (
            <div
              key={event.event_id}
              className="allday_event event__item"
              style={{
                top: index * SPACE,
                width: `${100 * eventLength}%`,
              }}
            >
              <EventItem
                event={event}
                hasPrev={hasPrev}
                hasNext={hasNext}
                multiday
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderTodayEvents = (todayEvents: ProcessedEvent[], today: Date) => {
    const crossingIds: Array<number | string> = [];
    return (
      <div className="events_col">
        {todayEvents.map((event, i) => {
          const height =
            differenceInMinutes(event.end, event.start) * MINUTE_HEIGHT;
          const top =
            differenceInMinutes(event.start, setHours(today, startHour)) *
            MINUTE_HEIGHT;
          const withinSameDay = todayEvents.filter(
            (e) =>
              e.event_id !== event.event_id &&
              (isWithinInterval(addMinutes(event.start, 1), {
                start: e.start,
                end: e.end,
              }) ||
                isWithinInterval(addMinutes(event.end, -1), {
                  start: e.start,
                  end: e.end,
                }))
          );

          const alreadyRendered = withinSameDay.filter((e) =>
            crossingIds.includes(e.event_id)
          );
          crossingIds.push(event.event_id);

          return (
            <div
              key={event.event_id}
              className="event__item"
              style={{
                height: height,
                top: top,
                width: withinSameDay.length
                  ? `${100 / (withinSameDay.length + 1) + 10}%`
                  : "",
                [direction === "rtl" ? "right" : "left"]: alreadyRendered.length
                  ? `${
                      alreadyRendered.length *
                      (98 / (alreadyRendered.length + 1.7))
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

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(
        events,
        resource,
        resourceFields,
        fields
      );
    }

    return (
      <Fragment>
        <tr>
          <td className="indent borderd"></td>
          <td className="borderd">
            <table className="week_day_table">
              <tbody>
                <tr>
                  {daysList.map((date, i) => (
                    <td
                      key={i}
                      className={isToday(date) ? "today_cell" : ""}
                      style={{
                        borderBottom: 0,
                        borderRight:
                          direction === "rtl"
                            ? i === 0
                              ? 0
                              : "1px solid #eeeeee"
                            : "",
                        borderLeft:
                          direction === "ltr"
                            ? i === 0
                              ? 0
                              : "1px solid #eeeeee"
                            : "",
                      }}
                    >
                      <TodayTypo date={date} onClick={handleGotoDay} />
                      {renderMultiDayEvents(recousedEvents, date)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td className="borderd">
            <table className="hour_table">
              <thead>
                <tr>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {hours.map((h, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ height: CELL_HEIGHT }}>
                        <Typography variant="caption">
                          {format(h, "hh:mm a", { locale: locale })}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          <td className="borderd">
            <table className="cells_table">
              <style>{`
              .cells_table tr:last-child td {
                border-width: ${
                  direction === "rtl" ? "0 1px 0 0" : "0 0 0 1px"
                };
              }
              .cells_table td:first-child {
                border-${direction === "rtl" ? "right" : "left"}: 0;
              }
              `}</style>
              <thead>
                <tr>
                  {daysList.map((date, i) => {
                    const todayEvents = recousedEvents
                      .filter(
                        (e) =>
                          isSameDay(date, e.start) &&
                          !differenceInDays(e.end, e.start)
                      )
                      .sort((a, b) => a.end.getTime() - b.end.getTime());
                    return (
                      <td key={i}>{renderTodayEvents(todayEvents, date)}</td>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {hours.map((h, i) => (
                  <tr key={i}>
                    {daysList.map((date, i) => {
                      const start = new Date(
                        `${format(date, "yyyy MM dd")} ${format(h, "hh:mm a")}`
                      );
                      const end = new Date(
                        `${format(date, "yyyy MM dd")} ${format(
                          addHours(h, 1),
                          "hh:mm a"
                        )}`
                      );
                      const field = resourceFields.idField;
                      return (
                        <td
                          key={i}
                          className={isToday(date) ? "today_cell" : ""}
                        >
                          {cellRenderer ? (
                            <div className="c_cell">
                              {cellRenderer({
                                day: date,
                                start,
                                end,
                                height: CELL_HEIGHT,
                                onClick: () =>
                                  triggerDialog(true, {
                                    start,
                                    end,
                                    [field]: resource ? resource[field] : null,
                                  }),
                              })}
                            </div>
                          ) : (
                            <ButtonBase
                              className="c_cell"
                              style={{ height: CELL_HEIGHT, width: "100%" }}
                              onClick={() => {
                                triggerDialog(true, {
                                  start,
                                  end,
                                  [field]: resource ? resource[field] : null,
                                });
                              }}
                            ></ButtonBase>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </Fragment>
    );
  };

  return (
    <tbody className="borderd">
      {resources.length ? (
        <WithResources span={daysList.length} renderChildren={renderTable} />
      ) : (
        renderTable()
      )}
    </tbody>
  );
};

export { Week };
