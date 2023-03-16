import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button } from "@mui/material";
import { format, getMonth, setMonth } from "date-fns";
import { LocaleArrow } from "../common/LocaleArrow";
import { useStore } from "../../store";

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const { locale, navigationPickerProps } = useStore();
  const [open, setOpen] = useState(false);
  const currentMonth = getMonth(selectedDate);

  const toggleDialog = () => setOpen(!open);

  const handleChange = (e: Date | null) => {
    onChange(e || new Date(), "selectedDate");
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
    <>
      <LocaleArrow type="prev" onClick={handlePrev} />
      <DateProvider>
        <DatePicker
          {...navigationPickerProps}
          open={open}
          onClose={toggleDialog}
          openTo="month"
          views={["year", "month"]}
          value={selectedDate}
          onChange={handleChange}
          renderInput={(params) => (
            <Button
              ref={params.inputRef}
              style={{ padding: 4, fontSize: "0.65rem" }}
              onClick={toggleDialog}
            >
              {format(selectedDate, "MMMM yyyy", { locale })}
            </Button>
          )}
        />
      </DateProvider>
      <LocaleArrow type="next" onClick={handleNext} />
    </>
  );
};

export { MonthDateBtn };
