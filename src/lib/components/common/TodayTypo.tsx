import { Typography } from "@material-ui/core";
import { format, isToday } from "date-fns";
import { Fragment } from "react";

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
        className={onClick ? "day_clickable" : ""}
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
