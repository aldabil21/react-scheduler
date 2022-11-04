import { alpha, styled } from "@mui/material";

export const Wrapper = styled("div")<{ dialog: number }>(({ theme, dialog }) => ({
  position: "relative",
  overflow: "hidden",
  "& .rs__table_loading": {
    background: dialog ? "" : alpha(theme.palette.background.paper, 0.4),
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999999,
    "& > span": {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "& >span": {
        marginBottom: 15,
      },
    },
  },
}));

export const Table = styled("div")<{ resource_count: number }>(({ resource_count }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: `repeat(${resource_count}, 1fr)`,
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
}));
export const TableGrid = styled("div")<{ days: number; indent?: string }>(
  ({ days, indent = "1", theme }) => ({
    position: "relative",
    display: "grid",
    gridTemplateColumns: +indent > 0 ? `10% repeat(${days}, 1fr)` : `repeat(${days}, 1fr)`,
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: +indent > 0 ? `30px repeat(${days}, 1fr)` : "",
    },
    "&:first-of-type": {
      borderStyle: "solid",
      borderColor: "#eee",
      borderWidth: "0 1px 1px 0",
    },
    "& .rs__cell": {
      position: "relative",
      "&.rs__header > :first-of-type": {
        padding: "2px 5px",
      },
      "&.rs__time": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
          writingMode: "vertical-rl",
        },
      },
      borderColor: "#eee",
      borderWidth: "1px 0px 0px 1px",
      borderStyle: "solid",
      // [`&:nth-of-type(${days + 1}n)`]: {
      //   borderWidth: "1px 1px 0px 1px",
      // },
      "& > button": {
        width: "100%",
        height: "100%",
        borderRadius: 0,
        cursor: "pointer",
        "&:hover": {
          background: alpha(theme.palette.primary.main, 0.1),
        },
      },
      "& .rs__event__item": {
        position: "absolute",
        zIndex: 1,
      },
      "& .rs__multi_day": {
        position: "absolute",
        zIndex: 1,
        textOverflow: "ellipsis",
      },
      "& .rs__block_col": {
        display: "block",
        position: "relative",
      },
      "& .rs__hover__op": {
        cursor: "pointer",
        "&:hover": {
          opacity: 0.7,
          textDecoration: "underline",
        },
      },
    },
  })
);

export const PopperInner = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  "& > div": {
    padding: "5px 10px",
    "& .rs__popper_actions": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& .MuiIconButton-root": {
        color: theme.palette.primary.contrastText,
      },
    },
  },
}));

export const EventActions = styled("div")(({ theme }) => ({
  display: "inherit",
  "& .MuiIconButton-root": {
    color: theme.palette.primary.contrastText,
  },
  "& .MuiButton-root": {
    "&.delete": {
      color: theme.palette.error.main,
    },
    "&.cancel": {
      color: theme.palette.action.disabled,
    },
  },
}));

export const TimeIndicatorBar = styled("div")(({ theme }) => ({
  position: "absolute",
  zIndex: theme.zIndex.tooltip,
  width: "100%",
  display: "flex",
  "& > div:first-of-type": {
    height: 12,
    width: 12,
    borderRadius: "50%",
    background: theme.palette.error.light,
    marginLeft: -6,
    marginTop: -5,
  },
  "& > div:last-of-type": {
    borderTop: `solid 2px ${theme.palette.error.light}`,
    width: "100%",
  },
}));
