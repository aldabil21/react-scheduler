import { SchedulerProps } from "../types";
import { useStore } from "../store";

const useScheduler = () => {
  const {
    handleState,
    selectedDate,
    handleGotoDay,
    triggerDialog,
    triggerLoading,
    events,
    locale,
    resources,
    resourceViewMode,
    hourFormat,
    view,
    height,
  } = useStore();

  const setEvents = (events: SchedulerProps["events"]) => {
    handleState(events, "events");
  };

  const setSelectedDate = (date: SchedulerProps["selectedDate"]) => {
    handleState(date, "selectedDate");
  };

  const setView = (view: SchedulerProps["view"]) => {
    handleState(view, "view");
  };

  const setResourceViewMode = (mode: SchedulerProps["resourceViewMode"]) => {
    handleState(mode, "resourceViewMode");
  };

  const setSchedulerLocale = (locale: SchedulerProps["locale"]) => {
    handleState(locale, "locale");
  };

  const serResources = (resources: SchedulerProps["resources"]) => {
    handleState(resources, "resources");
  };

  const setHourFormat = (format: SchedulerProps["hourFormat"]) => {
    handleState(format, "hourFormat");
  };

  const setHeight = (height: SchedulerProps["height"]) => {
    handleState(height, "height");
  };

  const setDirection = (direction: SchedulerProps["direction"]) => {
    handleState(direction, "direction");
  };

  return {
    events,
    setEvents,
    selectedDate,
    setSelectedDate,
    goToDay: handleGotoDay,
    view,
    setView,
    schedulerLocale: locale,
    setSchedulerLocale,
    triggerDialog,
    resources,
    serResources,
    resourceViewMode,
    setResourceViewMode,
    hourFormat,
    setHourFormat,
    triggerLoading,
    height,
    setHeight,
    setDirection,
  };
};

export { useScheduler };
