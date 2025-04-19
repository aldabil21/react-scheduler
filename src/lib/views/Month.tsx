import { useEffect, useCallback } from "react";
import { addDays, eachWeekOfInterval, endOfMonth, startOfMonth } from "date-fns";
import { DefaultResource } from "../types";
import { getResourcedEvents, sortEventsByTheEarliest } from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import useStore from "../hooks/useStore";
import { MonthAgenda } from "./MonthAgenda";
import MonthTable from "../components/month/MonthTable";

const Month = () => {
  const {
    month,
    selectedDate,
    events,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    agenda,
  } = useStore();

  const { weekStartOn, weekDays } = month!;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysList.length, getRemoteEvents]);

  useEffect(() => {
    if (getRemoteEvents instanceof Function) {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderTable = useCallback(
    (resource?: DefaultResource) => {
      if (agenda) {
        let resourcedEvents = sortEventsByTheEarliest(events);
        if (resource) {
          resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
        }

        return <MonthAgenda resource={resource} events={resourcedEvents} />;
      }

      return <MonthTable daysList={daysList} eachWeekStart={eachWeekStart} resource={resource} />;
    },
    [agenda, daysList, eachWeekStart, events, fields, resourceFields]
  );

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Month };
