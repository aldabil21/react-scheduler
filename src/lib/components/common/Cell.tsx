import { Button } from "@mui/material";
import { useCellAttributes } from "../../hooks/useCellAttributes";
import { CellRenderedProps } from "../../types";
import { JSX } from "react";

interface CellProps {
  day: Date;
  start: Date;
  height: number;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  children?: JSX.Element;
}

const Cell = ({
  day,
  start,
  end,
  resourceKey,
  resourceVal,
  cellRenderer,
  height,
  children,
}: CellProps) => {
  const props = useCellAttributes({ start, end, resourceKey, resourceVal });

  if (cellRenderer) {
    return cellRenderer({
      day,
      start,
      end,
      height,
      ...props,
    });
  }

  return (
    <Button
      fullWidth
      aria-label={`${start.toLocaleString("en", {
        dateStyle: "full",
        timeStyle: "long",
      })} - ${end.toLocaleString("en", { dateStyle: "full", timeStyle: "long" })}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Cell;
