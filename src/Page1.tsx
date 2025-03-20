import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";
import { Link } from "react-router";

const events = EVENTS.slice(3, 6);

function Page1() {
  const calendarRef = useRef<SchedulerRef>(null);

  return (
    <>
      <div>
        <Link to="/">Go to home</Link>
      </div>

      <Scheduler
        ref={calendarRef}
        events={events}
        // events={generateRandomEvents(200)}
      />
    </>
  );
}

export default Page1;
