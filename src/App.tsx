import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";
import { Link } from "react-router";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  return (
    <>
      <div>
        <Link to="/1">Go to page 1</Link>
      </div>

      <Scheduler
        ref={calendarRef}
        events={EVENTS}
        // events={generateRandomEvents(200)}
      />
    </>
  );
}

export default App;
