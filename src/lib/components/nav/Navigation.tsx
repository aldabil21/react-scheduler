import { Fragment, useState } from "react";
import {
  Button,
  useTheme,
  useMediaQuery,
  Popover,
  MenuList,
  MenuItem,
  IconButton,
} from "@mui/material";
import { WeekDateBtn } from "./WeekDateBtn";
import { DayDateBtn } from "./DayDateBtn";
import { MonthDateBtn } from "./MonthDateBtn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useStore from "../../hooks/useStore";

export type View = "month" | "week" | "day";

const Navigation = () => {
  const {
    selectedDate,
    view,
    week,
    handleState,
    getViews,
    translations,
    navigation,
    day,
    month,
    disableViewNavigator,
    onSelectedDateChange,
    onViewChange,
  } = useStore();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const views = getViews();

  const toggleMoreMenu = (el?: Element) => {
    setAnchorEl(el || null);
  };

  const handleSelectedDateChange = (date: Date) => {
    handleState(date, "selectedDate");

    if (onSelectedDateChange && typeof onSelectedDateChange === "function") {
      onSelectedDateChange(date);
    }
  };

  const handleChangeView = (view: View) => {
    handleState(view, "view");
    if (onViewChange && typeof onViewChange === "function") {
      onViewChange(view);
    }
  };

  const renderDateSelector = () => {
    switch (view) {
      case "month":
        return (
          month?.navigation && (
            <MonthDateBtn selectedDate={selectedDate} onChange={handleSelectedDateChange} />
          )
        );
      case "week":
        return (
          week?.navigation && (
            <WeekDateBtn
              selectedDate={selectedDate}
              onChange={handleSelectedDateChange}
              weekProps={week!}
            />
          )
        );
      case "day":
        return (
          day?.navigation && (
            <DayDateBtn selectedDate={selectedDate} onChange={handleSelectedDateChange} />
          )
        );
      default:
        return "";
    }
  };

  if (!navigation && disableViewNavigator) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div data-testid="date-navigator">{navigation && renderDateSelector()}</div>

      <div
        data-testid="view-navigator"
        style={{
          visibility: disableViewNavigator ? "hidden" : "visible",
        }}
      >
        <Button
          onClick={() => handleSelectedDateChange(new Date())}
          aria-label={translations.navigation.today}
        >
          {translations.navigation.today}
        </Button>
        {views.length > 1 &&
          (isDesktop ? (
            views.map((v) => (
              <Button
                key={v}
                color={v === view ? "primary" : "inherit"}
                onClick={() => handleChangeView(v)}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleChangeView(v);
                }}
              >
                {translations.navigation[v]}
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
                onClose={() => {
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
                  {views.map((v) => (
                    <MenuItem
                      key={v}
                      selected={v === view}
                      onClick={() => {
                        toggleMoreMenu();
                        handleChangeView(v);
                      }}
                    >
                      {translations.navigation[v]}
                    </MenuItem>
                  ))}
                </MenuList>
              </Popover>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export { Navigation };
