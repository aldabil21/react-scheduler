import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  return (
    <div style={{ padding: 12 }}>
      <Scheduler
        ref={calendarRef}
        events={EVENTS}
        view="day"
        agenda
        // resources={RESOURCES}
        // resourceFields={{
        //   idField: "admin_id",
        //   textField: "title",
        //   subTextField: "mobile",
        //   avatarField: "title",
        //   colorField: "color",
        // }}
        // resourceViewMode="tabs"
        // events={generateRandomEvents(200)}
      />
    </div>
  );
}

export default App;
