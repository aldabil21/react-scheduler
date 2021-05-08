import React from "react";
import Dateutils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useAppState } from "../../hooks/useAppState";

interface AuxProps {
  children: React.ReactChild | React.ReactChildren;
}
const DateProvider = ({ children }: AuxProps) => {
  const { locale } = useAppState();
  return (
    <MuiPickersUtilsProvider utils={Dateutils} locale={locale}>
      {children}
    </MuiPickersUtilsProvider>
  );
};

export default DateProvider;
