import { useEffect, useCallback, Fragment } from "react";
import { Avatar, Typography, useTheme } from "@material-ui/core";
import {
  addDays,
  eachWeekOfInterval,
  format,
  isSameMonth,
  isToday,
  setHours,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import MonthEvents from "../components/events/MonthEvents";
import { useAppState } from "../hooks/useAppState";
import { DayHours, DefaultRecourse, ProcessedEvent } from "../Scheduler";
import { getResourcedEvents } from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface MonthProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
}

const Month = () => {
  const {
    month,
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
  } = useAppState();

  const { weekStartOn, weekDays, startHour, endHour } = month!;
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const eachWeekStart = eachWeekOfInterval(
    {
      start: monthStart,
      end: monthEnd,
    },
    { weekStartsOn: weekStartOn }
  );
  const daysList = weekDays.map((d) => addDays(eachWeekStart[0], d));
  const CELL_HEIGHT = height / eachWeekStart.length;
  const theme = useTheme();

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const start = eachWeekStart[0];
      const end = addDays(
        eachWeekStart[eachWeekStart.length - 1],
        daysList.length
      );
      const query = `?start=${start}&end=${end}`;
      const events = await remoteEvents!(query);
      handleState(events, "events");
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
  }, [fetchEvents, remoteEvents]);

  const renderDays = () => {
    return daysList.map((date, i) => (
      <td key={i} align="center">
        <div>{format(date, "EE")}</div>
      </td>
    ));
  };

  const renderCells = (events: ProcessedEvent[]) => {
    const rows: JSX.Element[] = [];

    for (const startDay of eachWeekStart) {
      const cells = weekDays.map((d) => {
        const today = addDays(startDay, d);
        return (
          <td key={d.toString()}>
            <div
              style={{ height: CELL_HEIGHT }}
              className="c_cell"
              onClick={() => {
                const start = new Date(
                  `${format(setHours(today, startHour), "yyyy MM dd hh:mm a")}`
                );
                const end = new Date(
                  `${format(setHours(today, endHour), "yyyy MM dd hh:mm a")}`
                );
                triggerDialog(true, { start, end });
              }}
            >
              <Avatar
                style={{
                  width: 27,
                  height: 27,
                  background: isToday(today)
                    ? theme.palette.secondary.main
                    : "transparent",
                  color: isToday(today)
                    ? theme.palette.secondary.contrastText
                    : "",
                  marginBottom: 2,
                }}
              >
                <Typography
                  color={
                    !isSameMonth(today, monthStart)
                      ? "textSecondary"
                      : "textPrimary"
                  }
                  className="day_clickable"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGotoDay(today);
                  }}
                >
                  {format(today, "dd")}
                </Typography>
              </Avatar>
              <div className="events_col">
                <MonthEvents
                  events={events}
                  today={today}
                  eachWeekStart={eachWeekStart}
                  daysList={daysList}
                  onViewMore={handleGotoDay}
                />
              </div>
            </div>
          </td>
        );
      });
      rows.push(<tr key={startDay.toString()}>{cells}</tr>);
    }
    return rows;
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(events, resource, resourceFields);
    }
    return (
      <Fragment>
        <tr>
          <td>
            <table className="month_day_table">
              <tbody>
                <tr>{renderDays()}</tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table className="month_cells">
              <tbody>{renderCells(recousedEvents)}</tbody>
            </table>
          </td>
        </tr>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <tbody className="borderd">
        {resources.length ? (
          <WithResources renderChildren={renderTable} />
        ) : (
          renderTable()
        )}
      </tbody>
    </Fragment>
  );
};

export { Month };
