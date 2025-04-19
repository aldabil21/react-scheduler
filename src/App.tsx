import { Scheduler } from "./lib";
import { EVENTS, RESOURCES } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";
import { Link } from "react-router-dom";

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
        resources={RESOURCES}
        week={{
          weekStartOn: 0,
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          startHour: 8,
          endHour: 20,
          step: 30,
        }}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          subTextField: "mobile",
          avatarField: "title",
          colorField: "color",
        }}
        // events={generateRandomEvents(200)}
      />
    </>
  );
}

export default App;
