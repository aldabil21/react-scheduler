import { DragEvent, useMemo } from "react";
import { ProcessedEvent } from "../types";
import useStore from "./useStore";
import { DRAG_IMAGE } from "../helpers/constants";

const useResizeAttributes = (
  event: ProcessedEvent,
  onDragMove?: (time: Date | undefined) => void
) => {
  const { setCurrentResize, onResize, onResizeEnd, minuteHeight } = useStore();
  const handlers = useMemo(
    () =>
      minuteHeight
        ? {
            draggable: true,
            onDragStart: (e: DragEvent<HTMLElement>) => {
              e.stopPropagation();
              setCurrentResize(event);
              e.dataTransfer.setDragImage(DRAG_IMAGE, 0, 0);
            },
            onDragEnd: (e: DragEvent<HTMLElement>) => {
              setCurrentResize();
              onResizeEnd(e, event, minuteHeight);
              onDragMove?.(undefined);
            },
            onDrag: (e: DragEvent<HTMLElement>) => {
              e.stopPropagation();
              e.preventDefault();
              const date = onResize(e, event, minuteHeight);
              onDragMove?.(date);
            },
            onDragOver: (e: DragEvent<HTMLElement>) => {
              e.stopPropagation();
              e.preventDefault();
            },
            onDragEnter: (e: DragEvent<HTMLElement>) => {
              e.stopPropagation();
              e.preventDefault();
            },
          }
        : { draggable: false },
    [event, minuteHeight, onResize, setCurrentResize, onResizeEnd, onDragMove]
  );
  return handlers;
};

export default useResizeAttributes;
