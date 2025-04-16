import { enUS } from "date-fns/locale";
import { SchedulerProps } from "../types";
import { getOneView, getTimeZonedDate } from "../helpers/generals";

const defaultMonth = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 6,
  startHour: 9,
  endHour: 17,
  navigation: true,
  disableGoToDay: false,
};

const defaultWeek = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 6,
  startHour: 9,
  endHour: 17,
  step: 60,
  navigation: true,
  disableGoToDay: false,
};

const defaultDay = {
  startHour: 9,
  endHour: 17,
  step: 60,
  navigation: true,
};

const defaultResourceFields = {
  idField: "assignee",
  textField: "text",
  subTextField: "subtext",
  avatarField: "avatar",
  colorField: "color",
};

const defaultTranslations = (trans: Partial<SchedulerProps["translations"]> = {}) => {
  const { navigation, form, event, ...other } = trans;

  return {
    navigation: Object.assign(
      {
        month: "Month",
        week: "Week",
        day: "Day",
        agenda: "Agenda",
        today: "Today",
      },
      navigation
    ),
    form: Object.assign(
      {
        addTitle: "Add Event",
        editTitle: "Edit Event",
        confirm: "Confirm",
        delete: "Delete",
        cancel: "Cancel",
      },
      form
    ),
    event: Object.assign(
      {
        title: "Title",
        start: "Start",
        end: "End",
        allDay: "All Day",
      },
      event
    ),
    ...Object.assign(
      { moreEvents: "More...", loading: "Loading...", noDataToDisplay: "No data to display" },
      other
    ),
  };
};

const defaultViews = (props: Partial<SchedulerProps>) => {
  const { month, week, day } = props;
  return {
    month: month !== null ? Object.assign(defaultMonth, month) : null,
    week: week !== null ? Object.assign(defaultWeek, week) : null,
    day: day !== null ? Object.assign(defaultDay, day) : null,
  };
};

export const defaultProps = (props: Partial<SchedulerProps>) => {
  // We're pulling values out of props that we don't want to
  // pass on, so there are 'unused' ones here.
  const {
    translations,
    resourceFields,
    view,
    agenda,
    selectedDate,
    resourceViewMode,
    direction,
    dialogMaxWidth,
    hourFormat,
    ...otherProps
  } = props;

  const views = defaultViews(props);
  const defaultView = view || "week";
  const initialView = views[defaultView] ? defaultView : getOneView(views);
  return {
    ...views,
    translations: defaultTranslations(translations),
    resourceFields: Object.assign(defaultResourceFields, resourceFields),
    view: initialView,
    selectedDate: getTimeZonedDate(selectedDate || new Date(), props.timeZone),
    height: 600,
    navigation: true,
    disableViewNavigator: false,
    events: [],
    fields: [],
    loading: undefined,
    customEditor: undefined,
    onConfirm: undefined,
    onDelete: undefined,
    viewerExtraComponent: undefined,
    resources: [],
    resourceHeaderComponent: undefined,
    resourceViewMode: resourceViewMode || "default",
    direction: direction || "ltr",
    dialogMaxWidth: dialogMaxWidth || "md",
    locale: enUS,
    deletable: true,
    editable: true,
    resizable: true,
    hourFormat: hourFormat || "12",
    draggable: true,
    agenda,
    enableAgenda: typeof agenda === "undefined" || agenda,
    ...otherProps,
  };
};

export const initialStore = {
  ...defaultProps({}),
  setProps: () => {},
  dialog: false,
  selectedRange: undefined,
  selectedEvent: undefined,
  selectedResource: undefined,
  handleState: () => {},
  getViews: () => [],
  toggleAgenda: () => {},
  triggerDialog: () => {},
  triggerLoading: () => {},
  handleGotoDay: () => {},
  confirmEvent: () => {},
  setCurrentDragged: () => {},
  setMinuteHeight: () => {},
  setCurrentResize: () => {},
  onDrop: () => {},
  onResize: () => undefined,
  onResizeEnd: () => {},
};
