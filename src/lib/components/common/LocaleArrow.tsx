import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { IconButton, IconButtonProps } from "@mui/material";
import { MouseEvent } from "react";
import useStore from "../../hooks/useStore";

interface LocaleArrowProps extends Omit<IconButtonProps, "type"> {
  type: "prev" | "next";
  onClick?(e?: MouseEvent): void;
}
const LocaleArrow = ({ type, onClick, ...props }: LocaleArrowProps) => {
  const { direction } = useStore();

  let Arrow = NavigateNextRoundedIcon;
  if (type === "prev") {
    Arrow = direction === "rtl" ? NavigateNextRoundedIcon : NavigateBeforeRoundedIcon;
  } else if (type === "next") {
    Arrow = direction === "rtl" ? NavigateBeforeRoundedIcon : NavigateNextRoundedIcon;
  }

  return (
    <IconButton
      style={{ padding: 2 }}
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }}
      {...props}
    >
      <Arrow />
    </IconButton>
  );
};

export { LocaleArrow };
