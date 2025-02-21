import { useCallback, useEffect, useState } from "react";
import DateProvider from "../hoc/DateProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import useStore from "../../hooks/useStore";

interface EditorDatePickerProps {
  type?: "date" | "datetime";
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
  type = "datetime",
  value,
  label,
  name,
  onChange,
  variant = "outlined",
  error,
  errMsg,
  touched,
  required,
}: EditorDatePickerProps) => {
  const { translations } = useStore();
  const [state, setState] = useState({
    touched: false,
    valid: !!value,
    errorMsg: errMsg
      ? errMsg
      : required
        ? translations?.validation?.required || "Required"
        : undefined,
  });

  const Picker = type === "date" ? DatePicker : DateTimePicker;

  const hasError = state.touched && (error || !state.valid);

  const handleChange = useCallback(
    (value: string | Date) => {
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
    },
    [errMsg, name, onChange, required, translations?.validation?.required]
  );

  useEffect(() => {
    if (touched) {
      handleChange(value);
    }
  }, [handleChange, touched, value]);

  return (
    <DateProvider>
      <Picker
        value={value instanceof Date ? value : new Date(value)}
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

export { EditorDatePicker };
