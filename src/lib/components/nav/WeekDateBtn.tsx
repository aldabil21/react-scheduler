import React, { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@material-ui/pickers";
import { Button, IconButton } from "@material-ui/core";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { WeekProps } from "../../views/Week";
import NavigateBeforeRoundedIcon from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { addDays } from "date-fns/esm";

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
        <NavigateBeforeRoundedIcon />
      </IconButton>
      <Button style={{ padding: 4 }} onClick={toggleDialog}>{`${format(
        weekStart,
        "dd"
      )} - ${format(weekEnd, "dd MMMM yyyy")}`}</Button>
      <IconButton style={{ padding: 2 }} onClick={handleNext}>
        <NavigateNextRoundedIcon />
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
