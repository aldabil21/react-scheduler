import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@material-ui/pickers";
import { Button } from "@material-ui/core";
import { format, getMonth, setMonth } from "date-fns";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { LocaleArrow } from "../common/LocaleArrow";
import { useAppState } from "../../hooks/useAppState";

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const { locale } = useAppState();
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
      <LocaleArrow type="prev" onClick={handlePrev} />
      <Button style={{ padding: 4 }} onClick={toggleDialog}>
        {format(selectedDate, "MMMM yyyy", { locale: locale })}
      </Button>
      <LocaleArrow type="next" onClick={handleNext} />
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
