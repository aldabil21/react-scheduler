import { useEffect, useCallback, Fragment } from "react";
import { Avatar, Box, Divider, Paper, Stack, Typography, useTheme } from "@mui/material";
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
import { getResourcedEvents, sortEventsByTheLengthest } from "../helpers/generals";
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
    stickyNavitation,
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
  const CELL_HEIGHT = 300; //height / eachWeekStart.length
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
      let resourcedEvents = sortEventsByTheLengthest(events);
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
              <div
                style={{
                  height: CELL_HEIGHT,
                  width: "100%",
                  // background: "#ff000033",
                  display: "flex",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <Stack justifyContent={"space-between"} width={"100%"} alignItems={"center"}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        borderBottom: "1px solid #ccc",
                        width: "100%",
                        display: "flex",
                      }}
                    >
                      <Cell
                        start={start}
                        end={end}
                        day={selectedDate}
                        height={CELL_HEIGHT}
                        resourceKey={field}
                        resourceVal={resource ? resource[field] : null}
                        cellRenderer={cellRenderer}
                      />
                    </div>
                  ))}
                </Stack>
              </div>
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
                        }
                      }}
                    >
                      {format(today, "dd")}
                    </Typography>
                  </Avatar>
                )}
                <MonthEvents
                  events={todayEvents}
                  today={today}
                  eachWeekStart={eachWeekStart}
                  eachFirstDayInCalcRow={eachFirstDayInCalcRow}
                  daysList={daysList}
                  onViewMore={handleGotoDay}
                  cellHeight={CELL_HEIGHT}
                />
              </Fragment>
            </span>
          );
        });

        rows.push(
          <>
            <TableGrid
              days={daysList.length + 1}
              ref={headersRef}
              indent="0"
              sticky="1"
              stickyNavitation={stickyNavitation}
            >
              <Typography
                className="rs__cell rs__header rs__header__center"
                align="center"
                variant="body2"
              ></Typography>
              {daysList.map((date, i) => (
                <Typography
                  key={i}
                  className="rs__cell rs__header rs__header__center"
                  align="center"
                  variant="body2"
                >
                  {(() => {
                    const a = new Date(startDay);
                    a.setDate(a.getDate() + i);
                    return a.getDate();
                  })()}
                  {format(date, "EE", { locale })}
                </Typography>
              ))}
            </TableGrid>
            {/* Time Cells */}
            <TableGrid days={daysList.length + 1} ref={bodyRef} indent="0">
              <Fragment key={startDay.toString()}>
                <span style={{ height: CELL_HEIGHT, display: "flex" }} className="rs__cell">
                  <Stack justifyContent={"space-between"} width={"100%"} alignItems={"center"}>
                    {["1 - 2", "3 - 4", "5 - 6", " 7 ", " 8 "].map((i) => (
                      <Box
                        key={i}
                        style={{
                          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                          width: "100%",
                          textAlign: "center",
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {i}
                      </Box>
                    ))}
                  </Stack>
                </span>
                {cells}
              </Fragment>
            </TableGrid>
          </>
        );
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
    ]
  );

  const renderTable = useCallback(
    (resource?: DefaultRecourse) => {
      return <>{renderCells(resource)}</>;
    },
    [bodyRef, daysList, headersRef, locale, renderCells, stickyNavitation]
  );

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Month };
