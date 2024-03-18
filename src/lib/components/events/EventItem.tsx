import { Fragment, MouseEvent, useMemo, useState } from "react";
import { Typography, ButtonBase, useTheme } from "@mui/material";
import { format } from "date-fns";
import { ProcessedEvent } from "../../types";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import { EventItemPaper } from "../../styles/styles";
import { differenceInDaysOmitTime, getHourFormat } from "../../helpers/generals";
import useStore from "../../hooks/useStore";
import useDragAttributes from "../../hooks/useDragAttributes";
import EventItemPopover from "./EventItemPopover";

interface EventItemProps {
  event: ProcessedEvent;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const EventItem = ({ event, multiday, hasPrev, hasNext, showdate = true }: EventItemProps) => {
  const {
    direction,
    locale,
    hourFormat,
    eventRenderer,
    onEventClick,
    view,
    draggable,
    editable,
    disableViewer,
  } = useStore();
  const dragProps = useDragAttributes(event);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = getHourFormat(hourFormat);

  const NextArrow = direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;
  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;

  const triggerViewer = (el?: MouseEvent<Element>) => {
    if (!el?.currentTarget && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el?.currentTarget || null);
  };

  const isDraggable = useMemo(() => {
    // if Disabled
    if (event.disabled || !editable) return false;

    // global-wise isDraggable
    let canDrag = typeof draggable !== "undefined" ? draggable : true;

    // Override by event-wise
    if (typeof event.draggable !== "undefined") {
      canDrag = event.draggable;
    }
    return canDrag;
  }, [draggable, editable, event.disabled, event.draggable]);

  const renderEvent = useMemo(() => {
    // Check if has custom render event method
    // only applicable to non-multiday events and not in month-view
    if (typeof eventRenderer === "function" && !multiday && view !== "month") {
      const custom = eventRenderer({ event, onClick: triggerViewer, ...dragProps });
      if (custom) {
        return (
          <EventItemPaper key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}>
            {custom}
          </EventItemPaper>
        );
      }
    }

    let item = (
      <div style={{ padding: "2px 6px" }}>
        <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
          {event.title}
        </Typography>
        {showdate && (
          <Typography style={{ fontSize: 11 }} noWrap>
            {`${format(event.start, hFormat, {
              locale,
            })} - ${format(event.end, hFormat, { locale })}`}
          </Typography>
        )}
      </div>
    );
    if (multiday) {
      item = (
        <div
          style={{
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 11 }} noWrap>
            {hasPrev ? (
              <PrevArrow fontSize="small" sx={{ display: "flex" }} />
            ) : (
              showdate && !hideDates && format(event.start, hFormat, { locale })
            )}
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ fontSize: 12 }} noWrap>
            {event.title}
          </Typography>
          <Typography sx={{ fontSize: 11 }} noWrap>
            {hasNext ? (
              <NextArrow fontSize="small" sx={{ display: "flex" }} />
            ) : (
              showdate && !hideDates && format(event.end, hFormat, { locale })
            )}
          </Typography>
        </div>
      );
    }
    return (
      <EventItemPaper
        key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}
        disabled={event.disabled}
        sx={{
          bgcolor: event.disabled ? "#d0d0d0" : event.color || theme.palette.primary.main,
          color: event.disabled ? "#808080" : event.textColor || theme.palette.primary.contrastText,
          ...(event.sx || {}),
        }}
      >
        <ButtonBase
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerViewer(e);
            if (typeof onEventClick === "function") {
              onEventClick(event);
            }
          }}
          disabled={disableViewer || event.disabled}
        >
          <div {...dragProps} draggable={isDraggable}>
            {item}
          </div>
        </ButtonBase>
      </EventItemPaper>
    );
    // eslint-disable-next-line
  }, [hasPrev, hasNext, event, isDraggable, locale, theme.palette]);

  return (
    <Fragment>
      {renderEvent}

      {/* Viewer */}
      <EventItemPopover anchorEl={anchorEl} event={event} onTriggerViewer={triggerViewer} />
    </Fragment>
  );
};

export default EventItem;
