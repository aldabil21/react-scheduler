import { SchedulerState } from "./stateContext";

interface Action {
  type: string;
  payload: any;
}

const stateReducer = (state: SchedulerState, action: Action) => {
  switch (action.type) {
    case "set":
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    case "triggerDialog":
      const selected = action.payload.selected;
      return {
        ...state,
        dialog: action.payload.status || !state.dialog,
        selectedRange: selected?.event_id ? null : selected,
        selectedEvent: selected?.event_id ? selected : null,
      };

    case "triggerLoading":
      return {
        ...state,
        loading: action.payload.status || !state.loading,
      };
    default:
      return state;
  }
};
export { stateReducer };
