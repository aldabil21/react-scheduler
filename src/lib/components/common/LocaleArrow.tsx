import { useAppState } from "../../hooks/useAppState";
import NavigateBeforeRoundedIcon from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";

interface LocaleArrowProps {
  type: "prev" | "next";
}
const LocaleArrow = (props: LocaleArrowProps) => {
  const { type } = props;
  const { direction } = useAppState();

  let Arrow = NavigateNextRoundedIcon;
  if (type === "prev") {
    Arrow =
      direction === "rtl" ? NavigateNextRoundedIcon : NavigateBeforeRoundedIcon;
  } else if (type === "next") {
    Arrow =
      direction === "rtl" ? NavigateBeforeRoundedIcon : NavigateNextRoundedIcon;
  }

  return <Arrow {...props} />;
};

export { LocaleArrow };
