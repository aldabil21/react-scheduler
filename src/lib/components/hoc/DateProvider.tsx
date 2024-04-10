import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useStore from "../../hooks/useStore";

interface AuxProps {
  children: React.ReactNode;
}

const DateProvider = ({ children }: AuxProps) => {
  const { dateAdapter, locale } = useStore();

  return (
    <LocalizationProvider dateAdapter={dateAdapter} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
