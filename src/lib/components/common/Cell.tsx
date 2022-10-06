import { Button } from "@mui/material";
import { useDropAttributes } from "../../hooks/useDropAttributes";
import { CellRenderedProps } from "../../types";

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
  const props = useDropAttributes({ start, end, resourceKey, resourceVal });

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
    <Button fullWidth {...props}>
      {children}
    </Button>
  );
};

export default Cell;
