import { useEffect, useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import useStore from "../../hooks/useStore";

interface EditorDatePickerProps {
  type: "date" | "datetime";
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  value: Date | string;
  name: string;
  onChange(name: string, date: Date): void;
  error?: boolean;
  errMsg?: string;
  touched?: boolean;
  required?: boolean;
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
  touched,
  required,
}: EditorDatePickerProps) => {
  const [state, setState] = useState({
    touched: false,
    valid: !!value,
    errorMsg: errMsg ? errMsg : required ? "Required" : undefined,
  });
  const { translations } = useStore();

  const Picker = type === "date" ? DatePicker : DateTimePicker;

  const hasError = state.touched && (error || !state.valid);

  useEffect(() => {
    if (touched) {
      handleChange(value);
    }
    // eslint-disable-next-line
  }, [touched]);

  const handleChange = (value: string | Date) => {
    const isValidDate = !isNaN(Date.parse(value as string));
    const val = typeof value === "string" && isValidDate ? new Date(value) : value;
    let isValid = true;
    let errorMsg = errMsg;
    if (required && !val) {
      isValid = false;
      errorMsg = errMsg || translations?.validation?.required || "Required";
    }

    setState((prev) => {
      return { ...prev, touched: true, valid: isValid, errorMsg: errorMsg };
    });

    onChange(name, val as Date);
  };

  return (
    <DateProvider>
      <Picker
        value={value}
        label={label}
        onChange={(e) => {
          handleChange(e as Date);
        }}
        minutesStep={5}
        slotProps={{
          textField: {
            variant,
            helperText: hasError && state.errorMsg,
            error: hasError,
            fullWidth: true,
          },
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
