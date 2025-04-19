import { Avatar, Typography, useTheme } from "@mui/material";
import {
  addDays,
  endOfDay,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  setHours,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { Fragment, useCallback } from "react";
import {
  getHourFormat,
  getRecurrencesForDate,
  getResourcedEvents,
  isTimeZonedToday,
  sortEventsByTheEarliest,
} from "../../helpers/generals";
import useStore from "../../hooks/useStore";
import useSyncScroll from "../../hooks/useSyncScroll";
import { TableGrid } from "../../styles/styles";
import { DefaultResource } from "../../types";
import Cell from "../common/Cell";
import MonthEvents from "../events/MonthEvents";

type Props = {
  daysList: Date[];
  resource?: DefaultResource;
  eachWeekStart: Date[];
};

const MonthTable = ({ daysList, resource, eachWeekStart }: Props) => {
  const {
    height,
    month,
    selectedDate,
    events,
    handleGotoDay,
    resourceFields,
    fields,
    locale,
    hourFormat,
    stickyNavigation,
    timeZone,
    onClickMore,
  } = useStore();
  const { weekDays, startHour, endHour, cellRenderer, headRenderer, disableGoToDay } = month!;
  const { headersRef, bodyRef } = useSyncScroll();

  const theme = useTheme();
  const monthStart = startOfMonth(selectedDate);
  const hFormat = getHourFormat(hourFormat);
  const CELL_HEIGHT = height / eachWeekStart.length;

  const renderCells = useCallback(
    (resource?: DefaultResource) => {
      let resourcedEvents = sortEventsByTheEarliest(events);
      if (resource) {
        resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
      }
      const rows: React.ReactNode[] = [];

      for (const startDay of eachWeekStart) {
        const cells = weekDays.map((d) => {
          const today = addDays(startDay, d);
          const start = new Date(`${format(setHours(today, startHour), `yyyy/MM/dd ${hFormat}`)}`);
          const end = new Date(`${format(setHours(today, endHour), `yyyy/MM/dd ${hFormat}`)}`);
          const field = resourceFields.idField;
          const eachFirstDayInCalcRow = isSameDay(startDay, today) ? today : null;
          const todayEvents = resourcedEvents
            .flatMap((e) => getRecurrencesForDate(e, today))
            .filter((e) => {
              if (isSameDay(e.start, today)) return true;
              const dayInterval = { start: startOfDay(e.start), end: endOfDay(e.end) };
              if (eachFirstDayInCalcRow && isWithinInterval(eachFirstDayInCalcRow, dayInterval))
                return true;
              return false;
            });
          const isToday = isTimeZonedToday({ dateLeft: today, timeZone });
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
                  <div style={{ position: "absolute", top: 0 }}>
                    {headRenderer({ day: today, events: resourcedEvents, resource })}
                  </div>
                ) : (
                  <Avatar
                    style={{
                      width: 27,
                      height: 27,
                      position: "absolute",
                      top: 0,
                      background: isToday ? theme.palette.secondary.main : "transparent",
                      color: isToday ? theme.palette.secondary.contrastText : "",
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
                  resourceId={resource?.[field]}
                  today={today}
                  eachWeekStart={eachWeekStart}
                  eachFirstDayInCalcRow={eachFirstDayInCalcRow}
                  daysList={daysList}
                  onViewMore={(e) => {
                    if (onClickMore && typeof onClickMore === "function") {
                      onClickMore(e, handleGotoDay);
                    } else {
                      handleGotoDay(e);
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
      onClickMore,
      resourceFields,
      selectedDate,
      startHour,
      theme.palette.secondary.contrastText,
      theme.palette.secondary.main,
      timeZone,
      weekDays,
    ]
  );

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
};

export default MonthTable;
