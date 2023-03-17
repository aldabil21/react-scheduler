import { useCallback } from "react";
import { SchedulerProps } from "../types";
import { useStore } from "../store";

const useScheduler = () => {
  const {
    handleState,
    selectedDate,
    disableViewNavigator,
    handleGotoDay,
    triggerDialog,
    triggerLoading,
    events,
    locale,
    resources,
    resourceViewMode,
    hourFormat,
    timeZone,
    view,
    height,
  } = useStore();

  const setEvents = useCallback(
    (events: SchedulerProps["events"]) => {
      handleState(events, "events");
    },
    [handleState]
  );

  const setSelectedDate = useCallback(
    (date: SchedulerProps["selectedDate"]) => {
      handleState(date, "selectedDate");
    },
    [handleState]
  );

  const setDisableViewNavigator = useCallback(
    (disableViewNavigator: SchedulerProps["disableViewNavigator"]) => {
      handleState(disableViewNavigator, "disableViewNavigator");
    },
    [handleState]
  );

  const setView = useCallback(
    (view: SchedulerProps["view"]) => {
      handleState(view, "view");
    },
    [handleState]
  );

  const setResourceViewMode = useCallback(
    (mode: SchedulerProps["resourceViewMode"]) => {
      handleState(mode, "resourceViewMode");
    },
    [handleState]
  );

  const setSchedulerLocale = useCallback(
    (locale: SchedulerProps["locale"]) => {
      handleState(locale, "locale");
    },
    [handleState]
  );

  const setResources = useCallback(
    (resources: SchedulerProps["resources"]) => {
      handleState(resources, "resources");
    },
    [handleState]
  );

  const setHourFormat = useCallback(
    (format: SchedulerProps["hourFormat"]) => {
      handleState(format, "hourFormat");
    },
    [handleState]
  );

  const setTimeZone = useCallback(
    (timeZone: SchedulerProps["timeZone"]) => {
      handleState(timeZone, "timeZone");
    },
    [handleState]
  );

  const setHeight = useCallback(
    (height: SchedulerProps["height"]) => {
      handleState(height, "height");
    },
    [handleState]
  );

  const setDirection = useCallback(
    (direction: SchedulerProps["direction"]) => {
      handleState(direction, "direction");
    },
    [handleState]
  );

  const setOnEventDrop = useCallback(
    (onEventDrop: SchedulerProps["onEventDrop"]) => {
      handleState(onEventDrop, "onEventDrop");
    },
    [handleState]
  );

  const setOnEventClick = useCallback(
    (onEventClick: SchedulerProps["onEventClick"]) => {
      handleState(onEventClick, "onEventClick");
    },
    [handleState]
  );

  return {
    events,
    setEvents,
    disableViewNavigator,
    setDisableViewNavigator,
    selectedDate,
    setSelectedDate,
    goToDay: handleGotoDay,
    view,
    setView,
    schedulerLocale: locale,
    setSchedulerLocale,
    triggerDialog,
    resources,
    setResources,
    resourceViewMode,
    setResourceViewMode,
    hourFormat,
    setHourFormat,
    timeZone,
    setTimeZone,
    triggerLoading,
    height,
    setHeight,
    setDirection,
    setOnEventDrop,
    setOnEventClick,
  };
};

export { useScheduler };
