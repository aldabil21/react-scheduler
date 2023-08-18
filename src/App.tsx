import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  // const fetchRemote = async (query: RemoteQuery): Promise<ProcessedEvent[]> => {
  //   console.log({ query });
  //   /**Simulate fetchin remote data */
  //   return new Promise((res) => {
  //     setTimeout(() => {
  //       res(generateRandomEvents(200));
  //     }, 3000);
  //   });
  // };

  return (
    <Scheduler
      ref={calendarRef}
      events={EVENTS}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 14,
        step: 60,
        timeRanges: [
          { label: "1-2", value: 9 },
          { label: "3-4", value: 11 },
          { label: "5-6", value: 13 },
          { label: "7", value: 15 },
          { label: "8", value: 16 },
        ],
      }}
      // events={generateRandomEvents(200)}
    />
  );
}

export default App;
