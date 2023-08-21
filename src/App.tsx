import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { DayHours, SchedulerRef } from "./lib/types";
import { WeekDays } from "./lib/views/Month";

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
      view={"month"}
      month={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 14,
        headRenderer: (day) => {
          return <></>;
        },
      }}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 16,
        step: 60,
        timeRanges: [
          { label: "1", value: 9 },
          { label: "2", value: 10 },
          { label: "3", value: 11 },
          { label: "4", value: 12 },
          { label: "5", value: 13 },
          { label: "6", value: 14 },
          { label: "7", value: 15 },
          { label: "8", value: 16 },
        ],
      }}
      // events={generateRandomEvents(200)}
    />
  );
}

export default App;
