import { Scheduler } from "./lib";
import { EVENTS } from "./events";
import { useRef } from "react";
import { SchedulerRef } from "./lib/types";
import { MenuItem, Stack, TextField } from "@mui/material";

function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  const onChangeTimeZone = (timeZone: string) => {
    calendarRef.current?.scheduler.handleState(timeZone, "timeZone");
  };

  return (
    <Stack mt={2} spacing={2}>
      <TextField label="Time Zone" select onChange={(e) => onChangeTimeZone(e.target.value)}>
        <MenuItem value="Etc/GMT+12">UTC-12</MenuItem>
        <MenuItem value="Etc/GMT+11">UTC-11</MenuItem>
        <MenuItem value="Etc/GMT+10">UTC-10</MenuItem>
        <MenuItem value="Etc/GMT+9">UTC-9</MenuItem>
        <MenuItem value="Etc/GMT+8">UTC-8</MenuItem>
        <MenuItem value="Etc/GMT+7">UTC-7</MenuItem>
        <MenuItem value="Etc/GMT+6">UTC-6</MenuItem>
        <MenuItem value="Etc/GMT+5">UTC-5</MenuItem>
        <MenuItem value="Etc/GMT+4">UTC-4</MenuItem>
        <MenuItem value="Etc/GMT+3">UTC-3</MenuItem>
        <MenuItem value="Etc/GMT+2">UTC-2</MenuItem>
        <MenuItem value="Etc/GMT+1">UTC-1</MenuItem>
        <MenuItem value="Etc/GMT-0">UTC+0</MenuItem>
        <MenuItem value="Etc/GMT-1">UTC+1</MenuItem>
        <MenuItem value="Etc/GMT-2">UTC+2</MenuItem>
        <MenuItem value="Etc/GMT-3">UTC+3</MenuItem>
        <MenuItem value="Etc/GMT-4">UTC+4</MenuItem>
        <MenuItem value="Etc/GMT-5">UTC+5</MenuItem>
        <MenuItem value="Etc/GMT-6">UTC+6</MenuItem>
        <MenuItem value="Etc/GMT-7">UTC+7</MenuItem>
        <MenuItem value="Etc/GMT-8">UTC+8</MenuItem>
      </TextField>
      <Scheduler
        ref={calendarRef}
        events={EVENTS}
        // events={generateRandomEvents(200)}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 0,
          endHour: 24,
          step: 60,
          navigation: true,
        }}
      />
    </Stack>
  );
}

export default App;
