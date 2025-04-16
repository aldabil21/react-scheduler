import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import useStore from "./useStore";

const useArrowDisable = () => {
  const { selectedDate, week, navigationPickerProps, view } = useStore();
  const minDate = navigationPickerProps?.minDate;
  const maxDate = navigationPickerProps?.maxDate;
  const endDate =
    view === "month"
      ? endOfMonth(selectedDate)
      : view === "week"
        ? endOfWeek(selectedDate, { weekStartsOn: week?.weekStartOn })
        : selectedDate;
  const startDate =
    view === "month"
      ? startOfMonth(selectedDate)
      : view === "week"
        ? startOfWeek(selectedDate, { weekStartsOn: week?.weekStartOn })
        : selectedDate;
  const prevDisabled = minDate ? startDate <= minDate : false;
  const nextDisabled = maxDate ? endDate >= maxDate : false;

  return { prevDisabled, nextDisabled };
};

export default useArrowDisable;
