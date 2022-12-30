import { DragEvent } from "react";
import { DayProps } from "./views/Day";
import { StateItem } from "./views/Editor";
import { MonthProps } from "./views/Month";
import { WeekProps } from "./views/Week";
import { DialogProps, GridSize } from "@mui/material";
import { Locale } from "date-fns";
import { SelectOption } from "./components/inputs/SelectInput";
import { View } from "./components/nav/Navigation";
import { CalendarPickerProps } from "@mui/x-date-pickers";

export type DayHours =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;
export interface CellRenderedProps {
  day: Date;
  start: Date;
  end: Date;
  height: number;
  onClick(): void;
  onDragOver(e: DragEvent<HTMLButtonElement>): void;
  onDragEnter(e: DragEvent<HTMLButtonElement>): void;
  onDragLeave(e: DragEvent<HTMLButtonElement>): void;
  onDrop(e: DragEvent<HTMLButtonElement>): void;
}
interface CalendarEvent {
  event_id: number | string;
  title: string;
  start: Date;
  end: Date;
  disabled?: boolean;
  color?: string;
  editable?: boolean;
  deletable?: boolean;
  draggable?: boolean;
  allDay?: boolean;
}
export interface Translations {
  navigation: Record<View, string> & { today: string };
  form: {
    addTitle: string;
    editTitle: string;
    confirm: string;
    delete: string;
    cancel: string;
  };
  event: Record<string, string> & {
    title: string;
    start: string;
    end: string;
    allDay: string;
  };
  moreEvents: string;
  loading: string;
}

export type InputTypes = "input" | "date" | "select" | "hidden";
export interface FieldInputProps {
  /** Available to all InputTypes */
  label?: string;
  /** Available to all InputTypes */
  placeholder?: string;
  /** Available to all InputTypes
   * @defaul false
   */
  required?: boolean;
  /** Available to all InputTypes
   * @default "outline"
   */
  variant?: "standard" | "filled" | "outlined";
  /** Available to all InputTypes */
  disabled?: boolean;
  /** Available when @input="text" ONLY - Minimum length */
  min?: number;
  /** Available when @input="text" ONLY - Maximum length */
  max?: number;
  /** Available when @input="text" ONLY - Apply email Regex */
  email?: boolean;
  /** Available when @input="text" ONLY - Only numbers(int/float) allowed */
  decimal?: boolean;
  /** Available when @input="text" ONLY - Allow Multiline input. Use @rows property to set initial rows height */
  multiline?: boolean;
  /** Available when @input="text" ONLY - initial rows height*/
  rows?: number;
  /** Available when @input="date" ONLY
   * @default "datetime"
   */
  type?: "date" | "datetime";
  /** Available when @input="select" ONLY - Multi-Select input style.
   * if you use "default" property with this, make sure your "default" property is an instance of Array
   */
  multiple?: "chips" | "default";
  /** Available when @input="select" ONLY - display loading spinner instead of expand arrow */
  loading?: boolean;
  /** Available when @input="select" ONLY - Custom error message */
  errMsg?: string;

  /* Used for Grid alignment in a single row md | sm | xs */
  md?: GridSize;
  /* Used for Grid alignment in a single row md | sm | xs */
  sm?: GridSize;
  /* Used for Grid alignment in a single row md | sm | xs */
  xs?: GridSize;
}
export interface FieldProps {
  name: string;
  type: InputTypes;
  /** Required for type="select" */
  options?: Array<SelectOption>;
  default?: string | number | Date | any;
  config?: FieldInputProps;
}
export type ProcessedEvent = CalendarEvent & Record<string, any>;
export type EventActions = "create" | "edit";
export type ViewEvent = {
  start: Date;
  end: Date;
  view: "day" | "week" | "month";
};
export type DefaultRecourse = {
  assignee?: string | number;
  text?: string;
  subtext?: string;
  avatar?: string;
  color?: string;
} & Record<string, any>;
export type ResourceFields = {
  idField: string;
  textField: string;
  subTextField?: string;
  avatarField?: string;
  colorField?: string;
} & Record<string, string>;

export interface SchedulerHelpers {
  state: Record<string, StateItem>;
  close(): void;
  loading(status: boolean): void;
  edited?: ProcessedEvent;
  onConfirm(event: ProcessedEvent, action: EventActions): void;
}
export interface SchedulerProps {
  /**Min height of table
   * @default 600
   */
  height: number;
  /** Initial view to load */
  view: View;
  /**Month view settings */
  month: MonthProps | null;
  /**Week view settings */
  week: WeekProps | null;
  /**Day view settings */
  day: DayProps | null;
  /**Initial date selected */
  selectedDate: Date;
  /** Show/Hide date navigation */
  navigation?: boolean;
  /** */
  navigationPickerProps?: Partial<
    Omit<
      CalendarPickerProps<Date>,
      "open" | "onClose" | "openTo" | "views" | "value" | "readOnly" | "onChange" | "renderInput"
    >
  >;
  /**Events to display */
  events: ProcessedEvent[];
  /** Custom event render method */
  eventRenderer?: (event: ProcessedEvent) => JSX.Element | null;
  /**Async function to load remote data with current view data. */
  getRemoteEvents?(params: ViewEvent): Promise<ProcessedEvent[] | void>;
  /**Custom additional fields with it's settings */
  fields: FieldProps[];
  /**Table loading state */
  loading?: boolean;
  /**Async function triggered when add/edit event */
  onConfirm?(event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent>;
  /**Async function triggered when delete event */
  onDelete?(deletedId: string | number): Promise<string | number | void>;
  /**Override editor modal */
  customEditor?(scheduler: SchedulerHelpers): JSX.Element;
  /**Additional component in event viewer popper */
  viewerExtraComponent?:
    | JSX.Element
    | ((fields: FieldProps[], event: ProcessedEvent) => JSX.Element);
  /**Override viewer title component */
  viewerTitleComponent?(event: ProcessedEvent): JSX.Element;
  /**Resources array to split event views with resources */
  resources: DefaultRecourse[];
  /**Map resources fields */
  resourceFields: ResourceFields;
  /**Override header component of resource */
  recourseHeaderComponent?(resource: DefaultRecourse): JSX.Element;
  /**Resource header view mode
   * @default "default"
   */
  resourceViewMode: "default" | "tabs";
  /**Direction of table */
  direction: "rtl" | "ltr";
  /**Edito dialog maxWith
   * @default "md"
   */
  dialogMaxWidth: DialogProps["maxWidth"];
  /**
   * date-fns Locale object
   */
  locale: Locale;
  /**
   * Localization
   */
  translations: Translations;
  /**
   * Hour Format
   */
  hourFormat: "12" | "24";
  /**
   * Triggerd when event is dropped on time slot.
   */
  onEventDrop?(
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ): Promise<ProcessedEvent | void>;
  /**
   * If event is deletable, applied to all events globally, overridden by event specific deletable prop
   * @default true
   */
  deletable?: boolean;
  /**
   * If event is editable, applied to all events globally, overridden by event specific editable prop
   * @default true
   */
  editable?: boolean;
  /**
   * If event is draggable, applied to all events globally, overridden by event specific draggable prop
   * @default true
   */
  draggable?: boolean;
}
export interface Scheduler extends Partial<SchedulerProps> {}
