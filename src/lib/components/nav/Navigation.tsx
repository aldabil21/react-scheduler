import { Fragment, useState } from "react";
import {
  Button,
  useTheme,
  useMediaQuery,
  Popover,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { WeekDateBtn } from "./WeekDateBtn";
import { DayDateBtn } from "./DayDateBtn";
import { MonthDateBtn } from "./MonthDateBtn";
import { useAppState } from "../../hooks/useAppState";
import MoreVertIcon from "@material-ui/icons/MoreVert";

export type View = "month" | "week" | "day";

const Navigation = () => {
  const { selectedDate, view, week, handleState, getViews } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const toggleMoreMenu = (el?: Element) => {
    setAnchorEl(el || null);
  };

  const renderDateSelector = () => {
    switch (view) {
      case "month":
        return (
          <MonthDateBtn selectedDate={selectedDate} onChange={handleState} />
        );
      case "week":
        return (
          <WeekDateBtn
            selectedDate={selectedDate}
            onChange={handleState}
            weekProps={week!}
          />
        );
      case "day":
        return (
          <DayDateBtn selectedDate={selectedDate} onChange={handleState} />
        );
      default:
        return "";
    }
  };

  return (
    <div className="cal_nav">
      {renderDateSelector()}
      <div>
        <Button onClick={() => handleState(new Date(), "selectedDate")}>
          Today
        </Button>

        {isDesktop ? (
          getViews().map((v) => (
            <Button
              key={v}
              color={v === view ? "primary" : "default"}
              onClick={() => handleState(v, "view")}
            >
              {v}
            </Button>
          ))
        ) : (
          <Fragment>
            <IconButton
              style={{ padding: 5 }}
              onClick={(e) => {
                toggleMoreMenu(e.currentTarget);
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={(e) => {
                toggleMoreMenu();
              }}
              anchorOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuList autoFocusItem={!!anchorEl} disablePadding>
                {getViews().map((v) => (
                  <MenuItem
                    key={v}
                    selected={v === view}
                    onClick={() => {
                      toggleMoreMenu();
                      handleState(v, "view");
                    }}
                  >
                    {v}
                  </MenuItem>
                ))}
              </MenuList>
            </Popover>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export { Navigation };
