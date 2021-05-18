import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@material-ui/pickers";
import { Button } from "@material-ui/core";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format, addDays } from "date-fns";
import { LocaleArrow } from "../common/LocaleArrow";
import { useAppState } from "../../hooks/useAppState";

interface DayDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const DayDateBtn = ({ selectedDate, onChange }: DayDateBtnProps) => {
  const { locale } = useAppState();
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
        <LocaleArrow type="prev" onClick={handlePrev} />
        <Button style={{ padding: 4 }} onClick={toggleDialog}>{`${format(
          selectedDate,
          "dd, MMMM yyyy",
          {
            locale: locale,
          }
        )}`}</Button>
        <LocaleArrow type="next" onClick={handleNext} />
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
