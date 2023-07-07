import { ProcessedEvent } from "./lib/types";

export const EVENTS: ProcessedEvent[] = [
  {
    event_id: 1,
    title: "Event 1 (Disabled)",
    start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    disabled: true,
    admin_id: [1, 2, 3, 4],
  },
  {
    event_id: 2,
    title: "Event 2",
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    admin_id: 2,
    color: "#50b500",
  },
  {
    event_id: 3,
    title: "Event 3",
    start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    admin_id: 1,
    editable: false,
    deletable: false,
  },
  {
    event_id: 4,
    title: "Event 4",
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(new Date().getDate() - 2)
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(new Date().getDate() - 2)
    ),
    admin_id: [2, 3],
    color: "#900000",
    allDay: true,
  },
  {
    event_id: 5,
    title: "Event 5",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(new Date().getDate() - 2)
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(new Date().getDate() - 2)
    ),
    admin_id: 2,
    editable: true,
  },
  {
    event_id: 6,
    title: "Event 6",
    start: new Date(
      new Date(new Date(new Date().setHours(20)).setMinutes(30)).setDate(new Date().getDate() - 3)
    ),
    end: new Date(new Date(new Date().setHours(23)).setMinutes(0)),
    admin_id: 2,
    allDay: true,
  },
  {
    event_id: 7,
    title: "Event 7 (Not draggable)",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(new Date().getDate() - 3)
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(30)).setDate(new Date().getDate() - 3)
    ),
    admin_id: 1,
    draggable: false,
    color: "#8000cc",
  },
];

export const RECOURCES = [
  {
    admin_id: 1,
    title: "One",
    mobile: "555666777",
    avatar: "https://picsum.photos/200/300",
    color: "#ab2d2d",
  },
  {
    admin_id: 2,
    title: "Two",
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
    });
  }

  return events;
};
