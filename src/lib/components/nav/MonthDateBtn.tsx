import { useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DateCalendar } from "@mui/x-date-pickers";
import { Button, Popover } from "@mui/material";
import { format, getMonth, setMonth } from "date-fns";
import { LocaleArrow } from "../common/LocaleArrow";
import useStore from "../../hooks/useStore";
import useArrowDisable from "../../hooks/useArrowDisable";

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const { locale, navigationPickerProps } = useStore();
  const currentMonth = getMonth(selectedDate);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { prevDisabled, nextDisabled } = useArrowDisable();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e: Date | null) => {
    onChange(e || new Date());
    handleClose();
  };
  const handlePrev = () => {
    const prevMonth = currentMonth - 1;
    onChange(setMonth(selectedDate, prevMonth));
  };
  const handleNext = () => {
    const nextMonth = currentMonth + 1;
    onChange(setMonth(selectedDate, nextMonth));
  };
  return (
    <>
      <LocaleArrow
        type="prev"
        onClick={handlePrev}
        disabled={prevDisabled}
        aria-label="previous month"
      />
      <Button style={{ padding: 4 }} onClick={handleOpen} aria-label="selected month">
        {format(selectedDate, "MMMM yyyy", { locale })}
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
            openTo="month"
            views={["year", "month"]}
            value={selectedDate}
            onChange={handleChange}
          />
        </DateProvider>
      </Popover>
      <LocaleArrow
        type="next"
        onClick={handleNext}
        disabled={nextDisabled}
        aria-label="next month"
      />
    </>
  );
};

export { MonthDateBtn };
