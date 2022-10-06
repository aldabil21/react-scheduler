import { alpha, useTheme } from "@mui/material";
import { DragEvent } from "react";
import { useAppState } from "./useAppState";

interface Props {
  start: Date;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
}
export const useDropAttributes = ({ start, end, resourceKey, resourceVal }: Props) => {
  const { triggerDialog, onDrop } = useAppState();
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
      e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
      e.preventDefault();
    },
    onDragEnter: (e: DragEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
    },
    onDragLeave: (e: DragEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = "";
    },
    onDrop: (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = "";
      const eventId = e.dataTransfer.getData("text");
      onDrop(eventId, start, resourceKey, resourceVal);
    },
    [resourceKey]: resourceVal,
  };
};
