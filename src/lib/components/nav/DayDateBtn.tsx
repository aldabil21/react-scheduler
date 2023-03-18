import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import { Button, Popover } from "@mui/material";
import { format, addDays } from "date-fns";
import { LocaleArrow } from "../common/LocaleArrow";
import { useStore } from "../../store";

interface DayDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const DayDateBtn = ({ selectedDate, onChange }: DayDateBtnProps) => {
  const { locale, navigationPickerProps } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e: Date | null) => {
    onChange(e || new Date(), "selectedDate");
    handleClose();
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
    <>
      <LocaleArrow type="prev" onClick={handlePrev} />
      <Button style={{ padding: 4 }} onClick={handleOpen}>
        {format(selectedDate, "dd MMMM yyyy", { locale })}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <DateProvider>
          <DateCalendar
            {...navigationPickerProps}
            openTo="day"
            views={["month", "day"]}
            value={selectedDate}
            onChange={handleChange}
          />
        </DateProvider>
      </Popover>
      <LocaleArrow type="next" onClick={handleNext} />
    </>
  );
};

export { DayDateBtn };
