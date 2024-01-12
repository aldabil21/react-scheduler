import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { DayHours, SchedulerRef } from "./lib/types";
import { Button, Popover } from "@mui/material";
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
      events={EVENTS}
      hourFormat={"24"}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 9,
        endHour: 18,
        step: 60,
        hourRenderer: (hour: string) => (
          <div
            style={{
              background: "red",
            }}
          >
            <Button>{hour}</Button>
          </div>
        ),
      }}
      day={{
        startHour: 9,
        endHour: 18,
        step: 60,
        hourRenderer: (hour: string) => <Button>{hour}</Button>,
      }}
    />
  );
}

export default App;
