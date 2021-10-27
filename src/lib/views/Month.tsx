import { useEffect, useCallback, Fragment } from "react";
import { Avatar, Typography, useTheme } from "@mui/material";
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
import { DayHours, DefaultRecourse } from "../types";
import { getResourcedEvents } from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import CSS from "../assets/css/styles.module.css";
import { Cell } from "../components/common/Cell";

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
    handleGotoDay,
    remoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    direction,
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
      if (events && events?.length) {
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

  const renderDays = () => {
    return daysList.map((date, i) => (
      <td key={i} align="center">
        <div>{format(date, "EE")}</div>
      </td>
    ));
  };

  const renderCells = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(
        events,
        resource,
        resourceFields,
        fields
      );
    }
    const rows: JSX.Element[] = [];

    for (const startDay of eachWeekStart) {
      const cells = weekDays.map((d) => {
        const today = addDays(startDay, d);
        const start = new Date(
          `${format(setHours(today, startHour), "yyyy MM dd hh:mm a")}`
        );
        const end = new Date(
          `${format(setHours(today, endHour), "yyyy MM dd hh:mm a")}`
        );
        const field = resourceFields.idField;
        return (
          <td key={d.toString()}>
            <Cell
              height={CELL_HEIGHT}
              start={start}
              end={end}
              resourceKey={field}
              resourceVal={resource ? resource[field] : null}
            >
              <Fragment>
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
                    className={CSS.day_clickable}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGotoDay(today);
                    }}
                  >
                    {format(today, "dd")}
                  </Typography>
                </Avatar>
                <div className={CSS.events_col}>
                  <MonthEvents
                    events={recousedEvents}
                    today={today}
                    eachWeekStart={eachWeekStart}
                    daysList={daysList}
                    onViewMore={handleGotoDay}
                  />
                </div>
              </Fragment>
            </Cell>
          </td>
        );
      });
      rows.push(<tr key={startDay.toString()}>{cells}</tr>);
    }
    return rows;
  };

  const renderTable = (resource?: DefaultRecourse) => {
    return (
      <Fragment>
        <tr>
          <td>
            <table
              className={`${CSS.table} ${CSS.month_day_table} ${
                CSS[`month_day_table_${direction}`]
              }`}
            >
              <tbody>
                <tr>{renderDays()}</tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table
              className={`${CSS.table} ${CSS.month_cells} ${
                CSS[`month_cells_${direction}`]
              }`}
            >
              <tbody>{renderCells(resource)}</tbody>
            </table>
          </td>
        </tr>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <tbody className={CSS.borderd}>
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
