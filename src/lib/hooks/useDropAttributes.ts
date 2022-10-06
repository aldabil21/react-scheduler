import { alpha, useTheme } from "@mui/material";
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
    onDragOver: (e: any) => {
      e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
      e.preventDefault();
    },
    onDragEnter: (e: any) => {
      e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
    },
    onDragLeave: (e: any) => {
      e.currentTarget.style.backgroundColor = "";
    },
    onDrop: (e: any) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = "";
      const eventId = e.dataTransfer.getData("text");
      onDrop(eventId, start, resourceKey, resourceVal);
    },
    [resourceKey]: resourceVal,
  };
};
