import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAppState } from "../../hooks/useAppState";

interface AuxProps {
  children: React.ReactChild | React.ReactChildren;
}
const DateProvider = ({ children }: AuxProps) => {
  const { locale } = useAppState();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
