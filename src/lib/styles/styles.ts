import { Paper, alpha, styled } from "@mui/material";

export const Wrapper = styled("div")<{ dialog: number }>(({ theme, dialog }) => ({
  position: "relative",
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
  display: "flex",
  flexDirection: resource_count > 1 ? "row" : "column",
  width: "100%",
  boxSizing: "content-box",
  "& > div": {
    flexShrink: 0,
    flexGrow: 1,
  },
}));

export const TableGrid = styled("div")<{ days: number; sticky?: string; indent?: string }>(
  ({ days, sticky = "0", indent = "1", theme }) => ({
    display: "grid",
    gridTemplateColumns: +indent > 0 ? `10% repeat(${days}, 1fr)` : `repeat(${days}, 1fr)`,
    overflowX: "auto",
    overflowY: "hidden",
    position: sticky === "1" ? "sticky" : "relative",
    top: sticky === "1" ? 0 : undefined,
    zIndex: sticky === "1" ? 999 : undefined,
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: +indent > 0 ? `30px repeat(${days}, 1fr)` : "",
    },
    borderStyle: "solid",
    borderColor: theme.palette.grey[300],
    borderWidth: "0 0 0 1px",
    "&:first-of-type": {
      borderWidth: "1px 0 0 1px",
    },
    "&:last-of-type": {
      borderWidth: "0 0 1px 1px",
    },
    "& .rs__cell": {
      background: theme.palette.background.paper,
      position: "relative",
      borderStyle: "solid",
      borderColor: theme.palette.grey[300],
      borderWidth: "0 1px 1px 0",
      "&.rs__header": {
        "& > :first-of-type": {
          padding: "2px 5px",
        },
      },
      "&.rs__header__center": {
        padding: "6px 0px",
      },
      "&.rs__time": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        left: 0,
        zIndex: 999,
        [theme.breakpoints.down("sm")]: {
          writingMode: "vertical-rl",
        },
      },
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
      "&:not(.rs__time)": {
        minWidth: 65,
      },
    },
  })
);

export const EventItemPapper = styled(Paper)<{ color?: string; disabled?: boolean }>(
  ({ theme, color, disabled }) => ({
    width: "99.5%",
    height: "100%",
    display: "block",
    background: disabled ? "#d0d0d0" : color || theme.palette.primary.main,
    color: disabled ? "#808080" : theme.palette.primary.contrastText,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid #fff",
    overflow: "hidden",
    "& .MuiButtonBase-root": {
      width: "100%",
      height: "100%",
      display: "block",
      textAlign: "left",
      "& > div": {
        height: "100%",
        // padding: "2px 4px",
      },
    },
  })
);

export const PopperInner = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  width: 400,
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
  zIndex: 2,
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
