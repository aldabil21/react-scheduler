import { datetime, RRule } from "rrule";
import { ProcessedEvent } from "./lib/types";

const createDate = (
  startHour: number,
  startMinutes: number = 0,
  days: number = 0,
  months: number = 0
) => {
  const date = new Date();
  date.setHours(startHour);
  date.setMinutes(startMinutes);
  date.setDate(date.getDate() + days);
  date.setMonth(date.getMonth() + months);

  return date;
};

export const EVENTS: ProcessedEvent[] = [
  {
    event_id: 1,
    title: "Event 1 (Disabled)",
    subtitle: "This event is disabled",
    start: createDate(9),
    end: createDate(10),
    disabled: true,
    admin_id: [1, 2, 3, 4],
  },
  {
    event_id: 2,
    title: "Event 2",
    subtitle: "This event is draggable",
    start: createDate(10),
    end: createDate(12),
    admin_id: 2,
    color: "#50b500",
    agendaAvatar: "E",
  },
  {
    event_id: 3,
    title: "Event 3",
    subtitle: "This event is not editable",
    start: createDate(11),
    end: createDate(12),
    admin_id: 1,
    editable: false,
    deletable: false,
  },
  {
    event_id: 4,
    title: "Event 4",
    start: createDate(9, 30, -2),
    end: createDate(11, 0, -2),
    admin_id: [2, 3],
    color: "#900000",
    allDay: true,
  },
  {
    event_id: 5,
    title: "Event 5",
    subtitle: "This event is editable",
    start: createDate(10, 30, -2),
    end: createDate(14, 0, -2),
    admin_id: 2,
    editable: true,
  },
  {
    event_id: 6,
    title: "Event 6",
    subtitle: "This event is all day",
    start: createDate(20, 30, -3),
    end: createDate(23),
    admin_id: 2,
    allDay: true,
    sx: { color: "purple" },
  },
  {
    event_id: 7,
    title: "Event 7 (Not draggable)",
    subtitle: "This event is not draggable",
    start: createDate(10, 30, -3),
    end: createDate(14, 30, -3),
    admin_id: 1,
    draggable: false,
    color: "#8000cc",
  },
  {
    event_id: 8,
    title: "Event 8",
    subtitle: "This event has a custom color",
    start: createDate(10, 30, 30),
    end: createDate(14, 30, 30),
    admin_id: 1,
    color: "#8000cc",
  },
  {
    event_id: 9,
    title: "Event 9",
    subtitle: `This event is a recurring weekly until ${createDate(11, 0, 1, 1).toDateString()}`,
    start: createDate(10, 0, 1),
    end: createDate(11, 0, 1),
    recurring: new RRule({
      freq: RRule.WEEKLY,
      dtstart: convertDateToRRuleDate(createDate(11, 0, -20)),
      until: createDate(11, 0, 1, 1),
    }),
  },
  {
    event_id: 10,
    title: "Event 10",
    subtitle: "This event is a recurring hourly 3 times",
    start: createDate(14, 15),
    end: createDate(14, 45),
    recurring: new RRule({
      freq: RRule.HOURLY,
      count: 3,
      dtstart: convertDateToRRuleDate(createDate(14, 15)),
    }),
    color: "#dc4552",
  },
  {
    event_id: 11,
    title: "Event 11",
    subtitle: "This event is not resizable",
    start: createDate(10, 30, -4),
    end: createDate(12, 30, -4),
    admin_id: 1,
    resizable: false,
  },
];

export const RESOURCES = [
  {
    admin_id: 1,
    title: "One",
    mobile: "555666777",
    avatar: "",
    color: "#ab2d2d",
  },
  {
    admin_id: 2,
    title: "Two is very long name",
    mobile: "555666777",
    avatar: "https://picsum.photos/200/300",
    color: "#58ab2d",
  },
  {
    admin_id: 3,
    title: "Three",
    mobile: "555666777",
    avatar: "https://picsum.photos/200/300",
    color: "#a001a2",
  },
  {
    admin_id: 4,
    title: "Four",
    mobile: "555666777",
    avatar: "https://picsum.photos/200/300",
    color: "#08c5bd",
  },
];

export const generateRandomEvents = (total = 300) => {
  const events = [];
  for (let i = 0; i < total; i++) {
    const day = Math.round(i % 15);
    events.push({
      event_id: Math.random(),
      title: "Event " + (i + 1),
      start: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
          new Date().getDate() + day
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
          new Date().getDate() + day
        )
      ),
      // allDay: Math.random() > 0.5,
    });
  }

  return events;
};

function convertDateToRRuleDate(date: Date) {
  return datetime(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
}
