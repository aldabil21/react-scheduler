import { DragEvent } from "react";
import { View } from "../components/nav/Navigation";
import { DefaultResource, EventActions, ProcessedEvent, SchedulerProps } from "../types";

export type SelectedRange = { start: Date; end: Date };

export interface SchedulerState extends SchedulerProps {
  dialog: boolean;
  minuteHeight?: number;
  selectedRange?: SelectedRange;
  selectedEvent?: ProcessedEvent;
  selectedResource?: DefaultResource["assignee"];
  currentDragged?: ProcessedEvent;
  currentResize?: ProcessedEvent;
  enableAgenda?: boolean;
}

export interface Store extends SchedulerState {
  handleState(value: SchedulerState[keyof SchedulerState], name: keyof SchedulerState): void;
  getViews(): View[];
  toggleAgenda: () => void;
  triggerDialog(status: boolean, event?: SelectedRange | ProcessedEvent): void;
  triggerLoading(status: boolean): void;
  handleGotoDay(day: Date): void;
  confirmEvent(event: ProcessedEvent | ProcessedEvent[], action: EventActions): void;
  setCurrentDragged(event?: ProcessedEvent): void;
  setCurrentResize(event?: ProcessedEvent): void;
  setMinuteHeight(height?: number): void;
  onDrop(
    event: DragEvent<HTMLElement>,
    eventId: string,
    droppedStartTime: Date,
    resourceKey?: string,
    resourceVal?: string | number
  ): void;
  onResize(
    ev: DragEvent<HTMLElement>,
    event: ProcessedEvent,
    minuteHeight: number
  ): Date | undefined;
  onResizeEnd(ev: DragEvent<HTMLElement>, event: ProcessedEvent, minuteHeight: number): void;
}
