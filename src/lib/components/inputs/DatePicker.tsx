import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface EditorDatePickerProps {
  type: "date" | "datetime";
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  value: Date | string;
  name: string;
  onChange(name: string, date: Date): void;
  error?: boolean;
  errMsg?: string;
}

const EditorDatePicker = ({
  type,
  value,
  label,
  name,
  onChange,
  variant,
  error,
  errMsg,
}: EditorDatePickerProps) => {
  const Picker = type === "date" ? DatePicker : DateTimePicker;

  return (
    <DateProvider>
      <Picker
        value={value}
        label={label}
        onChange={(e) => onChange(name, new Date(e || ""))}
        minutesStep={5}
        slotProps={{
          textField: { variant, helperText: error ? errMsg : "", error, fullWidth: true },
        }}
      />
    </DateProvider>
  );
};

EditorDatePicker.defaultProps = {
  type: "datetime",
  variant: "outlined",
};
export { EditorDatePicker };
