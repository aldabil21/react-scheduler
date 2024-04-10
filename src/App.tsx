import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  return (
    <Scheduler
      ref={calendarRef}
      events={EVENTS}
      dateAdapter={AdapterDateFns}
      // events={generateRandomEvents(200)}
    />
  );
}

export default App;
