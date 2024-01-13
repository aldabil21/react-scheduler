import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { AgendaDiv } from "../styles/styles";
import { ProcessedEvent } from "../types";
import useStore from "../hooks/useStore";
import { Typography } from "@mui/material";
import { filterTodayAgendaEvents, isTimeZonedToday } from "../helpers/generals";
import AgendaEventsList from "../components/events/AgendaEventsList";

type Props = {
  daysList: Date[];
  events: ProcessedEvent[];
};
const WeekAgenda = ({ daysList, events }: Props) => {
  const { week, height, handleGotoDay, locale, timeZone, translations } = useStore();
  const { disableGoToDay, headRenderer } = week!;

  const hasEvents = useMemo(() => {
    return daysList.some((day) => filterTodayAgendaEvents(events, day).length > 0);
  }, [daysList, events]);

  if (!hasEvents)
    return (
      <AgendaDiv
        sx={{
          borderWidth: 1,
          padding: 1,
          height: height / 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="rs__cell rs__agenda_items">
          <Typography>{translations.noDataToDisplay}</Typography>
        </div>
      </AgendaDiv>
    );

  return (
    <AgendaDiv>
      {daysList.map((day, i) => {
        const today = isTimeZonedToday(day, timeZone);
        const dayEvents = filterTodayAgendaEvents(events, day);

        if (!dayEvents.length) return null;

        return (
          <div key={i} className={`rs__agenda_row ${isToday(day) ? "rs__today_cell" : ""}`}>
            <div className="rs__cell rs__agenda__cell">
              {typeof headRenderer === "function" ? (
                <div>{headRenderer(day)}</div>
              ) : (
                <Typography
                  sx={{ fontWeight: today ? "bold" : "inherit" }}
                  color={today ? "primary" : "inherit"}
                  variant="body2"
                  className={!disableGoToDay ? "rs__hover__op" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disableGoToDay) {
                      handleGotoDay(day);
                    }
                  }}
                >
                  {format(day, "dd E", { locale })}
                </Typography>
              )}
            </div>
            <div className="rs__cell rs__agenda_items">
              <AgendaEventsList events={dayEvents} />
            </div>
          </div>
        );
      })}
    </AgendaDiv>
  );
};

export { WeekAgenda };
