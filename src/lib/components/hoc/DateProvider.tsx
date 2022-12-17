import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useStore } from "../../store";

interface AuxProps {
  children: any;
}

const DateProvider = ({ children }: AuxProps) => {
  const { locale } = useStore();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns as any} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
