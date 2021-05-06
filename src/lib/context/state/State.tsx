import React, { useReducer } from "react";
import { getAvailableViews, getOneView } from "../../helpers/generals";
import { ProcessedEvent, SchedulerProps } from "../../Scheduler";
import {
  defaultProps,
  SchedulerState,
  SelectedRange,
  StateContext,
} from "./stateContext";
import { stateReducer } from "./stateReducer";

interface AppProps {
  children: React.ReactNode;
  initial: SchedulerProps;
}

const initialState = (initial: SchedulerProps): SchedulerState => {
  const initialView = initial[initial.view]
    ? initial.view
    : getOneView(initial);
  return {
    ...initial,
    view: initialView,
    dialog: false,
    selectedRange: undefined,
    fields: [...defaultProps.fields, ...initial.fields],
  };
};

const AppState = (props: AppProps) => {
  const [state, dispatch] = useReducer(
    stateReducer,
    initialState(props.initial)
  );

  const handleState = (
    value: SchedulerState[keyof SchedulerState],
    name: keyof SchedulerState
  ) => {
    dispatch({ type: "set", payload: { name, value } });
  };

  const getViews = () => getAvailableViews(state);

  const triggerDialog = (
    status: boolean | undefined,
    selected: SelectedRange | ProcessedEvent
  ) => {
    dispatch({ type: "triggerDialog", payload: { status, selected } });
  };
  const triggerLoading = (status: boolean | undefined) => {
    dispatch({ type: "triggerLoading", payload: { status } });
  };
  const handleGotoDay = (day: Date) => {
    const views = getViews();
    if (views.includes("day")) {
      handleState("day", "view");
      handleState(day, "selectedDate");
    } else if (views.includes("week")) {
      handleState("week", "view");
      handleState(day, "selectedDate");
    } else {
      console.warn("No Day/Week views available");
    }
  };
  return (
    <StateContext.Provider
      value={{
        ...state,
        handleState,
        getViews,
        triggerDialog,
        triggerLoading,
        handleGotoDay,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

export { AppState };
