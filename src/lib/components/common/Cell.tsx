import { alpha, useTheme } from "@mui/material";
import CSS from "../../assets/css/styles.module.css";
import { useAppState } from "../../hooks/useAppState";

interface CellProps {
  height: number;
  start: Date;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
  children?: JSX.Element;
}

const Cell = ({
  height,
  start,
  end,
  resourceKey,
  resourceVal,
  children,
}: CellProps) => {
  const { triggerDialog, onDrop } = useAppState();
  const theme = useTheme();

  return (
    <div
      className={CSS.c_cell}
      style={{ height: height, width: "100%" }}
      onClick={() => {
        triggerDialog(true, {
          start,
          end,
          [resourceKey]: resourceVal,
        });
      }}
      onDragOver={(e) => {
        e.currentTarget.style.backgroundColor = alpha(
          theme.palette.secondary.main,
          0.3
        );
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        e.currentTarget.style.backgroundColor = alpha(
          theme.palette.secondary.main,
          0.3
        );
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.backgroundColor = "";
      }}
      onDrop={(e) => {
        e.currentTarget.style.backgroundColor = "";
        const eventId = e.dataTransfer.getData("text");
        onDrop(eventId, start, resourceKey, resourceVal);
      }}
    >
      {children}
    </div>
  );
};

export { Cell };
