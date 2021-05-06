import React, { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@material-ui/pickers";
import { Button, IconButton } from "@material-ui/core";
import NavigateBeforeRoundedIcon from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { addDays } from "date-fns/esm";
import { format } from "date-fns";

interface DayDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const DayDateBtn = ({ selectedDate, onChange }: DayDateBtnProps) => {
  const [open, setOpen] = useState(false);
  const toggleDialog = () => setOpen(!open);

  const handleChange = (e: MaterialUiPickersDate) => {
    onChange(new Date(e || ""), "selectedDate");
  };

  const handlePrev = () => {
    const prevDay = addDays(selectedDate, -1);
    onChange(prevDay, "selectedDate");
  };
  const handleNext = () => {
    const nexDay = addDays(selectedDate, 1);
    onChange(nexDay, "selectedDate");
  };
  return (
    <div>
      <div>
        <IconButton style={{ padding: 2 }} onClick={handlePrev}>
          <NavigateBeforeRoundedIcon />
        </IconButton>
        <Button style={{ padding: 4 }} onClick={toggleDialog}>{`${format(
          selectedDate,
          "dd, MMMM yyyy"
        )}`}</Button>
        <IconButton style={{ padding: 2 }} onClick={handleNext}>
          <NavigateNextRoundedIcon />
        </IconButton>
      </div>
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

export { DayDateBtn };
