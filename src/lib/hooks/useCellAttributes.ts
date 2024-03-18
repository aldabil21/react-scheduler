import { DragEvent } from "react";
import { alpha, useTheme } from "@mui/material";
import useStore from "./useStore";

interface Props {
  start: Date;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
}
export const useCellAttributes = ({ start, end, resourceKey, resourceVal }: Props) => {
  const { triggerDialog, onDrop, currentDragged, setCurrentDragged } = useStore();
  const theme = useTheme();

  return {
    onClick: () => {
      triggerDialog(true, {
        start,
        end,
        [resourceKey]: resourceVal,
      });
    },
    onDragOver: (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (currentDragged) {
        e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
      }
    },
    onDragEnter: (e: DragEvent<HTMLButtonElement>) => {
      if (currentDragged) {
        e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
      }
    },
    onDragLeave: (e: DragEvent<HTMLButtonElement>) => {
      if (currentDragged) {
        e.currentTarget.style.backgroundColor = "";
      }
    },
    onDrop: (e: DragEvent<HTMLButtonElement>) => {
      if (currentDragged && currentDragged.event_id) {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = "";
        onDrop(e, currentDragged.event_id.toString(), start, resourceKey, resourceVal);
        setCurrentDragged();
      }
    },
    [resourceKey]: resourceVal,
  };
};
