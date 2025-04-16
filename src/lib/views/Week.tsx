import { useEffect, useCallback, JSX, useMemo } from "react";
import { startOfWeek, addDays, eachMinuteOfInterval, endOfDay, startOfDay, set } from "date-fns";
import { CellRenderedProps, DayHours, DefaultResource } from "../types";
import { WeekDays } from "./Month";
import { calcCellHeight, calcMinuteHeight, getResourcedEvents } from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import useStore from "../hooks/useStore";
import { WeekAgenda } from "./WeekAgenda";
import WeekTable from "../components/week/WeekTable";

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  hourRenderer?(hour: string): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

const Week = () => {
  const {
    week,
    selectedDate,
    height,
    events,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    agenda,
    setMinuteHeight,
  } = useStore();
  const { weekStartOn, weekDays, startHour, endHour, step } = week!;
  const _weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const daysList = weekDays.map((d) => addDays(_weekStart, d));
  const weekStart = startOfDay(daysList[0]);
  const weekEnd = endOfDay(daysList[daysList.length - 1]);
  const [hours, CELL_HEIGHT, MINUTE_HEIGHT] = useMemo(() => {
    const START_TIME = set(selectedDate, { hours: startHour, minutes: 0, seconds: 0 });
    const END_TIME = set(selectedDate, { hours: endHour, minutes: -step, seconds: 0 });
    const hours = eachMinuteOfInterval(
      {
        start: START_TIME,
        end: END_TIME,
      },
      { step }
    );
    const CELL_HEIGHT = calcCellHeight(height, hours.length);
    const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
    return [hours, CELL_HEIGHT, MINUTE_HEIGHT];
  }, [endHour, height, selectedDate, startHour, step]);

  useEffect(() => {
    setMinuteHeight(MINUTE_HEIGHT);
  }, [MINUTE_HEIGHT, setMinuteHeight]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRemoteEvents]);

  useEffect(() => {
    if (getRemoteEvents instanceof Function) {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderTable = (resource?: DefaultResource) => {
    let resourcedEvents = events;
    if (resource) {
      resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }

    if (agenda) {
      return <WeekAgenda daysList={daysList} events={resourcedEvents} />;
    }

    return (
      <WeekTable
        resourcedEvents={resourcedEvents}
        resource={resource}
        hours={hours}
        cellHeight={CELL_HEIGHT}
        minuteHeight={MINUTE_HEIGHT}
        daysList={daysList}
      />
    );
  };

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Week };
