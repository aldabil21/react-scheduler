import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@material-ui/pickers";
import { Button, IconButton } from "@material-ui/core";
import { endOfWeek, format, startOfWeek, addDays } from "date-fns";
import { WeekProps } from "../../views/Week";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { LocaleArrow } from "../common/LocaleArrow";
import { useAppState } from "../../hooks/useAppState";

interface WeekDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
  weekProps: WeekProps;
}

const WeekDateBtn = ({
  selectedDate,
  onChange,
  weekProps,
}: WeekDateBtnProps) => {
  const { locale } = useAppState();
  const [open, setOpen] = useState(false);
  const { weekStartOn } = weekProps;
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: weekStartOn });

  const toggleDialog = () => setOpen(!open);

  const handleChange = (e: MaterialUiPickersDate) => {
    onChange(new Date(e || ""), "selectedDate");
  };

  const handlePrev = () => {
    const ladtDayPrevWeek = addDays(weekStart, -1);
    onChange(ladtDayPrevWeek, "selectedDate");
  };
  const handleNext = () => {
    const firstDayNextWeek = addDays(weekEnd, 1);
    onChange(firstDayNextWeek, "selectedDate");
  };
  return (
    <div>
      <IconButton style={{ padding: 2 }} onClick={handlePrev}>
        <LocaleArrow type="prev" />
      </IconButton>
      <Button style={{ padding: 4 }} onClick={toggleDialog}>{`${format(
        weekStart,
        "dd",
        { locale: locale }
      )} - ${format(weekEnd, "dd MMMM yyyy", { locale: locale })}`}</Button>
      <IconButton style={{ padding: 2 }} onClick={handleNext}>
        <LocaleArrow type="next" />
      </IconButton>
      <DateProvider>
        <DatePicker
          open={open}
          variant="inline"
          inputProps={{ style: { height: 0, padding: 0 } }}
          style={{ display: "block", height: 0, visibility: "hidden" }}
          value={selectedDate}
          onChange={handleChange}
          onClose={toggleDialog}
          autoOk
        />
      </DateProvider>
    </div>
  );
};

export { WeekDateBtn };
