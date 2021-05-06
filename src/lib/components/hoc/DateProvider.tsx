import React from "react";
import Dateutils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

interface AuxProps {
  children: React.ReactChild | React.ReactChildren;
}
const DateProvider = ({ children }: AuxProps) => {
  return (
    <MuiPickersUtilsProvider utils={Dateutils}>
      {children}
    </MuiPickersUtilsProvider>
  );
};

export default DateProvider;
