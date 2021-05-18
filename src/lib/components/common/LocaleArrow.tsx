import { useAppState } from "../../hooks/useAppState";
import NavigateBeforeRoundedIcon from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import { IconButton } from "@material-ui/core";
import { MouseEvent } from "react";

interface LocaleArrowProps {
  type: "prev" | "next";
  onClick?(e?: MouseEvent): void;
}
const LocaleArrow = ({ type, onClick }: LocaleArrowProps) => {
  const { direction } = useAppState();

  let Arrow = NavigateNextRoundedIcon;
  if (type === "prev") {
    Arrow =
      direction === "rtl" ? NavigateNextRoundedIcon : NavigateBeforeRoundedIcon;
  } else if (type === "next") {
    Arrow =
      direction === "rtl" ? NavigateBeforeRoundedIcon : NavigateNextRoundedIcon;
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
    >
      <Arrow />
    </IconButton>
  );
};

export { LocaleArrow };
