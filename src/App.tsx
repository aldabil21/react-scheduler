import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  return (
    <Scheduler
      ref={calendarRef}
      events={EVENTS}
      // events={generateRandomEvents(200)}
      editable={false}
      // disableViewer
    />
  );
}

export default App;
