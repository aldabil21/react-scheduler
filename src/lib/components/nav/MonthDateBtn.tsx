import React, { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@material-ui/pickers";
import { Button, IconButton } from "@material-ui/core";
import { format, getMonth } from "date-fns";
import NavigateBeforeRoundedIcon from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { setMonth } from "date-fns/esm";

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const [open, setOpen] = useState(false);
  const currentMonth = getMonth(selectedDate);

  const toggleDialog = () => setOpen(!open);

  const handleChange = (e: MaterialUiPickersDate) => {
    onChange(new Date(e || ""), "selectedDate");
  };

  const handlePrev = () => {
    const prevMonth = currentMonth - 1;
    onChange(setMonth(selectedDate, prevMonth), "selectedDate");
  };
  const handleNext = () => {
    const nextMonth = currentMonth + 1;
    onChange(setMonth(selectedDate, nextMonth), "selectedDate");
  };
  return (
    <div>
      <IconButton style={{ padding: 2 }} onClick={handlePrev}>
        <NavigateBeforeRoundedIcon />
      </IconButton>
      <Button style={{ padding: 4 }} onClick={toggleDialog}>
        {format(selectedDate, "MMMM yyyy")}
      </Button>
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
          openTo="month"
          views={["year", "month"]}
        />
      </DateProvider>
    </div>
  );
};

export { MonthDateBtn };
