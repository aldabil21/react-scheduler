import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, IconButtonProps, TextFieldProps } from "@mui/material";
import { format, getMonth, setMonth } from "date-fns";
import { LocaleArrow } from "../common/LocaleArrow";
import { useStore } from "../../store";

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const { locale, navigationPickerProps } = useStore();
  const currentMonth = getMonth(selectedDate);

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
          openTo="month"
          views={["year", "month"]}
          value={selectedDate}
          onChange={handleChange}
          slots={{
            textField: (params: TextFieldProps) => (
              <Box display="inline-block" ref={params.InputProps?.ref}>
                {params.InputProps?.endAdornment}
              </Box>
            ),
            openPickerButton: (params: IconButtonProps) => (
              <Button style={{ padding: 4 }} onClick={params.onClick}>
                {format(selectedDate, "MMMM yyyy", { locale })}
              </Button>
            ),
          }}
        />
      </DateProvider>
      <LocaleArrow type="next" onClick={handleNext} />
    </>
  );
};

export { MonthDateBtn };
