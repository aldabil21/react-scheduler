import { DragEvent } from "react";
import { ProcessedEvent } from "../types";
import { useTheme } from "@mui/material";

const useDragAttributes = (event: ProcessedEvent) => {
  const theme = useTheme();
  return {
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.dataTransfer.setData("text/plain", `${event.event_id}`);
      e.currentTarget.style.backgroundColor = theme.palette.error.main;
    },
    onDragEnd: (e: DragEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = event.color || theme.palette.primary.main;
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragEnter: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
  };
};

export default useDragAttributes;
