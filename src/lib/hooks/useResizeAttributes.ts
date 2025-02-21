import { DragEvent, useMemo } from "react";
import { ProcessedEvent } from "../types";
import useStore from "./useStore";

const img = new Image();
img.style.pointerEvents = "none";
img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

const useResizeAttributes = (
  event: ProcessedEvent,
  minuteHeight?: number,
  onDragMove?: (time: Date | undefined) => void
) => {
  const { setCurrentResize, onResize, onResizeEnd } = useStore();
  const handlers = useMemo(
    () =>
      minuteHeight
        ? {
            draggable: true,
            onDragStart: (e: DragEvent<HTMLElement>) => {
              e.stopPropagation();
              setCurrentResize(event);
              e.dataTransfer.setDragImage(img, 0, 0);
            },
            onDragEnd: (e: DragEvent<HTMLElement>) => {
              setCurrentResize();
              onResizeEnd(e, event, minuteHeight);
              onDragMove?.(undefined);
            },
            onDrag: (e: DragEvent<HTMLElement>) => {
              e.stopPropagation();
              e.preventDefault();
              onDragMove?.(onResize(e, event, minuteHeight));
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
