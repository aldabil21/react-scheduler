import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import DateProvider from "../hoc/DateProvider";

interface EditorDatePickerProps {
  type: "date" | "datetime";
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  modalVariant?: "dialog" | "inline" | "static";
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
  modalVariant,
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
        style={{ width: "100%" }}
        inputVariant={variant}
        variant={modalVariant}
        // cancelLabel={t("common:cancel")}
        // okLabel={t("common:confirm")}
        format="dd-MMMM-yyyy hh:mm a"
        InputProps={{
          endAdornment: <CalendarTodayIcon color="disabled" />,
        }}
        helperText={error ? errMsg : ""}
        error={error}
        autoOk
        minutesStep={5}
      />
    </DateProvider>
  );
};

EditorDatePicker.defaultProps = {
  type: "datetime",
  variant: "outlined",
  modalVariant: "inline",
};
export { EditorDatePicker };
