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
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import MonthEvents from "../components/events/MonthEvents";
import { CellRenderedProps, DayHours, DefaultRecourse } from "../types";
import { getResourcedEvents, sortEventsByTheEarliest } from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import Cell from "../components/common/Cell";
import { TableGrid } from "../styles/styles";
import useSyncScroll from "../hooks/useSyncScroll";
import useStore from "../hooks/useStore";

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface MonthProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

const Month = () => {
  const {
    month,
    selectedDate,
    height,
    events,
    handleGotoDay,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    locale,
    hourFormat,
    stickyNavigation,
    onViewChange,
  } = useStore();

  const { weekStartOn, weekDays, startHour, endHour, cellRenderer, headRenderer, disableGoToDay } =
    month!;
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const eachWeekStart = eachWeekOfInterval(
    {
      start: monthStart,
      end: monthEnd,
    },
    { weekStartsOn: weekStartOn }
  );
  const hFormat = hourFormat === "12" ? "hh:mm a" : "HH:mm";
  const daysList = weekDays.map((d) => addDays(eachWeekStart[0], d));
  const CELL_HEIGHT = height / eachWeekStart.length;
  const theme = useTheme();
  const { headersRef, bodyRef } = useSyncScroll();

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const start = eachWeekStart[0];
      const end = addDays(eachWeekStart[eachWeekStart.length - 1], daysList.length);
      const events = await getRemoteEvents!({
        start,
        end,
        view: "month",
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

  const renderCells = useCallback(
    (resource?: DefaultRecourse) => {
      let resourcedEvents = sortEventsByTheEarliest(events);
      if (resource) {
        resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
      }
      const rows: JSX.Element[] = [];

      for (const startDay of eachWeekStart) {
        const cells = weekDays.map((d) => {
          const today = addDays(startDay, d);
          const start = new Date(`${format(setHours(today, startHour), `yyyy/MM/dd ${hFormat}`)}`);
          const end = new Date(`${format(setHours(today, endHour), `yyyy/MM/dd ${hFormat}`)}`);
          const field = resourceFields.idField;
          const eachFirstDayInCalcRow = isSameDay(startDay, today) ? today : null;
          const todayEvents = resourcedEvents.filter(
            (e) =>
              (eachFirstDayInCalcRow &&
                isWithinInterval(eachFirstDayInCalcRow, {
                  start: startOfDay(e.start),
                  end: endOfDay(e.end),
                })) ||
              isSameDay(e.start, today)
          );
          return (
            <span style={{ height: CELL_HEIGHT }} key={d.toString()} className="rs__cell">
              <Cell
                start={start}
                end={end}
                day={selectedDate}
                height={CELL_HEIGHT}
                resourceKey={field}
                resourceVal={resource ? resource[field] : null}
                cellRenderer={cellRenderer}
              />
              <Fragment>
                {typeof headRenderer === "function" ? (
                  <div style={{ position: "absolute", top: 0 }}>{headRenderer(today)}</div>
                ) : (
                  <Avatar
                    style={{
                      width: 27,
                      height: 27,
                      position: "absolute",
                      top: 0,
                      background: isToday(today) ? theme.palette.secondary.main : "transparent",
                      color: isToday(today) ? theme.palette.secondary.contrastText : "",
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      color={!isSameMonth(today, monthStart) ? "#ccc" : "textPrimary"}
                      className={!disableGoToDay ? "rs__hover__op" : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disableGoToDay) {
                          handleGotoDay(today);
                          if (onViewChange && typeof onViewChange === "function") {
                            onViewChange("day");
                          }
                        }
                      }}
                    >
                      {format(today, "dd")}
                    </Typography>
                  </Avatar>
                )}

                <MonthEvents
                  events={todayEvents}
                  resourceId={resource?.[field]}
                  today={today}
                  eachWeekStart={eachWeekStart}
                  eachFirstDayInCalcRow={eachFirstDayInCalcRow}
                  daysList={daysList}
                  onViewMore={(e) => {
                    handleGotoDay(e);
                    if (onViewChange && typeof onViewChange === "function") {
                      onViewChange("day");
                    }
                  }}
                  cellHeight={CELL_HEIGHT}
                />
              </Fragment>
            </span>
          );
        });

        rows.push(<Fragment key={startDay.toString()}>{cells}</Fragment>);
      }
      return rows;
    },
    [
      CELL_HEIGHT,
      cellRenderer,
      daysList,
      disableGoToDay,
      eachWeekStart,
      endHour,
      events,
      fields,
      hFormat,
      handleGotoDay,
      headRenderer,
      monthStart,
      resourceFields,
      selectedDate,
      startHour,
      theme.palette.secondary.contrastText,
      theme.palette.secondary.main,
      weekDays,
      onViewChange,
    ]
  );

  const renderTable = useCallback(
    (resource?: DefaultRecourse) => {
      return (
        <>
          {/* Header Days */}
          <TableGrid
            days={daysList.length}
            ref={headersRef}
            indent="0"
            sticky="1"
            stickyNavigation={stickyNavigation}
          >
            {daysList.map((date, i) => (
              <Typography
                key={i}
                className="rs__cell rs__header rs__header__center"
                align="center"
                variant="body2"
              >
                {format(date, "EE", { locale })}
              </Typography>
            ))}
          </TableGrid>
          {/* Time Cells */}
          <TableGrid days={daysList.length} ref={bodyRef} indent="0">
            {renderCells(resource)}
          </TableGrid>
        </>
      );
    },
    [bodyRef, daysList, headersRef, locale, renderCells, stickyNavigation]
  );

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Month };
