import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useStore from "../../hooks/useStore";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface AuxProps {
  children: React.ReactNode;
}

const DateProvider = ({ children }: AuxProps) => {
  const { locale } = useStore();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
