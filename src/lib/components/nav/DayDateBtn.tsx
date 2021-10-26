import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import DatePicker from "@mui/lab/DatePicker";
import { Button } from "@mui/material";
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

  const handleChange = (e: Date | null, k?: string) => {
    onChange(e || new Date(), "selectedDate");
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
      <LocaleArrow type="prev" onClick={handlePrev} />
      <DateProvider>
        <DatePicker
          open={open}
          onClose={toggleDialog}
          openTo="day"
          views={["month", "day"]}
          value={selectedDate}
          onChange={handleChange}
          renderInput={(params) => (
            <Button
              ref={params.inputRef}
              style={{ padding: 4 }}
              onClick={toggleDialog}
            >{`${format(selectedDate, "dd, MMMM yyyy", {
              locale: locale,
            })}`}</Button>
          )}
        />
      </DateProvider>
      <LocaleArrow type="next" onClick={handleNext} />
    </div>
  );
};

export { DayDateBtn };
