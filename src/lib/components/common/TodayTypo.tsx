import { Fragment } from "react";
import { Typography } from "@mui/material";
import { format, isToday } from "date-fns";
import CSS from "../../assets/css/styles.module.css";

interface TodayTypoProps {
  date: Date;
  onClick?(day: Date): void;
}

const TodayTypo = ({ date, onClick }: TodayTypoProps) => {
  return (
    <Fragment>
      <Typography
        style={{
          fontWeight: isToday(date) ? "bold" : "inherit",
        }}
        color={isToday(date) ? "primary" : "inherit"}
        className={onClick ? CSS.day_clickable : ""}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(date);
        }}
      >
        {format(date, "dd")}
      </Typography>
      <Typography
        color={isToday(date) ? "primary" : "inherit"}
        style={{
          fontWeight: isToday(date) ? "bold" : "inherit",
          fontSize: 11,
        }}
      >
        {format(date, "eee")}
      </Typography>
    </Fragment>
  );
};

export default TodayTypo;
