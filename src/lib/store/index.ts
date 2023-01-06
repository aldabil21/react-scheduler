import { useEffect, useState } from "react";
import { defaultProps, initialStore } from "./default";
import { Store } from "./types";
import { arraytizeFieldVal, getAvailableViews } from "../helpers/generals";
import { ProcessedEvent, Scheduler } from "../types";
import { addMinutes, differenceInMinutes, isEqual } from "date-fns";

const createEmitter = () => {
  const subscriptions = new Map<
    ReturnType<typeof Symbol>,
    React.Dispatch<React.SetStateAction<Store>>
  >();
  return {
    emit: (v: Store) => subscriptions.forEach((fn) => fn(v)),
    subscribe: (fn: React.Dispatch<React.SetStateAction<Store>>) => {
      const key = Symbol();
      subscriptions.set(key, fn);
      return () => {
        subscriptions.delete(key);
      };
    },
  };
};

const createStore = (
  init: (getter: () => Store, setter: (op: (store: Store) => Store) => void) => Store
) => {
  // create an emitter
  const emitter = createEmitter();

  let store: Store = initialStore;
  const get = () => store;
  const set = (op: (store: Store) => Store) => {
    store = op(store);
    // notify all subscriptions when the store updates
    emitter.emit(store);
  };
  store = init(get, set);

  const useStore = (initial?: Scheduler) => {
    // intitialize component with initial props or latest store
    const prev = get();
    const initVals = (initial ? { ...prev, ...defaultProps(initial) } : prev) as Store;
    const [localStore, setLocalStore] = useState(initVals);

    // update our local store when the global
    // store updates.
    //
    // emitter.subscribe returns a cleanup
    // function, so react will clean this
    // up on unmount.
    useEffect(() => emitter.subscribe(setLocalStore), []);

    useEffect(() => {
      if (initial) {
        set((s) => initVals);
      }
      // eslint-disable-next-line
    }, []);

    return localStore;
  };
  return useStore;
};

export const useStore = createStore((get, set) => ({
  ...get(),
  handleState: (value, name) => {
    set((prev) => ({ ...prev, [name]: value }));
  },
  getViews: () => {
    return getAvailableViews(get());
  },
  triggerDialog: (status, selected) => {
    const isEvent = selected as ProcessedEvent;

    set((prev) => ({
      ...prev,
      dialog: status,
      selectedRange: isEvent?.event_id
        ? undefined
        : isEvent || {
            start: new Date(),
            end: new Date(Date.now() + 60 * 60 * 1000),
          },
      selectedEvent: isEvent?.event_id ? isEvent : undefined,
    }));
  },
  triggerLoading: (status) => {
    // Trigger if not out-sourced by props
    if (typeof initialStore.loading === "undefined") {
      set((prev) => ({ ...prev, loading: status }));
    }
  },
  handleGotoDay: (day: Date) => {
    const currentViews = get().getViews();
    if (currentViews.includes("day")) {
      set((prev) => ({ ...prev, view: "day", selectedDate: day }));
    } else if (currentViews.includes("week")) {
      set((prev) => ({ ...prev, view: "week", selectedDate: day }));
    } else {
      console.warn("No Day/Week views available");
    }
  },
  confirmEvent: (event, action) => {
    const state = get();
    let updatedEvents: ProcessedEvent[];
    if (action === "edit") {
      updatedEvents = state.events.map((e) =>
        e.event_id === event.event_id ? { ...e, ...event } : e
      );
    } else {
      updatedEvents = [...state.events, event];
    }
    set((prev) => ({ ...prev, events: updatedEvents }));
  },
  onDrop: async (eventId, startTime, resKey, resVal) => {
    const state = get();
    // Get dropped event
    const droppedEvent = state.events.find((e) => {
      if (typeof e.event_id === "number") {
        return e.event_id === +eventId;
      }
      return e.event_id === eventId;
    }) as ProcessedEvent;

    // Check if has resource and if is multiple
    const resField = state.fields.find((f) => f.name === resKey);
    const isMultiple = !!resField?.config?.multiple;
    let newResource = resVal as string | number | string[] | number[];
    if (resField) {
      const eResource = droppedEvent[resKey as string];
      const currentRes = arraytizeFieldVal(resField, eResource, droppedEvent).value;
      if (isMultiple) {
        // if dropped on already owned resource
        if (currentRes.includes(resVal)) {
          // Omit if dropped on same time slot for multiple event
          if (isEqual(droppedEvent.start, startTime)) {
            return;
          }
          newResource = currentRes;
        } else {
          // if have multiple resource ? add other : move to other
          newResource = currentRes.length > 1 ? [...currentRes, resVal] : [resVal];
        }
      }
    }

    // Omit if dropped on same time slot for non multiple events
    if (isEqual(droppedEvent.start, startTime)) {
      if (!newResource || (!isMultiple && newResource === droppedEvent[resKey as string])) {
        return;
      }
    }

    // Update event time according to original duration & update resources/owners
    const diff = differenceInMinutes(droppedEvent.end, droppedEvent.start);
    const updatedEvent: ProcessedEvent = {
      ...droppedEvent,
      start: startTime,
      end: addMinutes(startTime, diff),
      [resKey as string]: newResource || "",
    };

    // Local
    if (!state.onEventDrop || typeof state.onEventDrop !== "function") {
      return state.confirmEvent(updatedEvent, "edit");
    }
    // Remote
    try {
      state.triggerLoading(true);
      const _event = await state.onEventDrop(startTime, updatedEvent, droppedEvent);
      if (_event) {
        state.confirmEvent(_event, "edit");
      }
    } finally {
      state.triggerLoading(false);
    }
  },
}));
