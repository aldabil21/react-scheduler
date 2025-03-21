import { Fragment, MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { Typography, ButtonBase, useTheme, Popper } from "@mui/material";
import { format } from "date-fns";
import { ProcessedEvent } from "../../types";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import { DragHandle, EventItemPaper } from "../../styles/styles";
import { differenceInDaysOmitTime, getHourFormat } from "../../helpers/generals";
import useStore from "../../hooks/useStore";
import useDragAttributes from "../../hooks/useDragAttributes";
import EventItemPopover from "./EventItemPopover";
import useEventPermissions from "../../hooks/useEventPermissions";
import useResizeAttributes from "../../hooks/useResizeAttributes";

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
    disableViewer,
    minuteHeight,
  } = useStore();
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [dragTime, setDragTime] = useState<Date>();
  const onDragMove = useCallback((time: Date | undefined) => {
    setDragTime(time);
  }, []);

  const dragProps = useDragAttributes(event);
  const resizeProps = useResizeAttributes(event, onDragMove);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = getHourFormat(hourFormat);

  const NextArrow = direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;
  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;

  const { canDrag, canResize } = useEventPermissions(event);
  const resizable = useMemo(
    () => !!canResize && !!minuteHeight && !multiday,
    [canResize, minuteHeight, multiday]
  );

  const triggerViewer = useCallback(
    (el?: MouseEvent<Element>) => {
      if (!el?.currentTarget && deleteConfirm) {
        setDeleteConfirm(false);
      }
      setAnchorEl(el?.currentTarget || null);
    },
    [deleteConfirm]
  );

  const renderEvent = useMemo(() => {
    // Check if has custom render event method
    // only applicable to non-multiday events and not in month-view
    if (typeof eventRenderer === "function" && !multiday && view !== "month") {
      const custom = eventRenderer({ event, onClick: triggerViewer, ...dragProps });
      if (custom) {
        return (
          <EventItemPaper key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}>
            {custom}
            <DragHandle {...resizeProps} draggable={resizable} ref={dragHandleRef} />
          </EventItemPaper>
        );
      }
    }

    let item = (
      <div style={{ padding: "2px 6px" }}>
        <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
          {event.title}
        </Typography>
        {event.subtitle && (
          <Typography variant="body2" style={{ fontSize: 11 }} noWrap>
            {event.subtitle}
          </Typography>
        )}
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
            if (!disableViewer) {
              triggerViewer(e);
            }
            onEventClick?.(event);
          }}
          focusRipple
          tabIndex={disableViewer ? -1 : 0}
          disableRipple={disableViewer}
          disabled={event.disabled}
        >
          <div {...dragProps} draggable={canDrag}>
            {item}
          </div>
        </ButtonBase>
        <DragHandle {...resizeProps} draggable={resizable} ref={dragHandleRef} />
      </EventItemPaper>
    );
  }, [
    eventRenderer,
    multiday,
    view,
    event,
    showdate,
    hFormat,
    locale,
    theme.palette.primary.main,
    theme.palette.primary.contrastText,
    disableViewer,
    dragProps,
    canDrag,
    triggerViewer,
    hasPrev,
    PrevArrow,
    hideDates,
    hasNext,
    NextArrow,
    onEventClick,
    resizable,
    resizeProps,
  ]);

  return (
    <Fragment>
      {renderEvent}

      {/* Viewer */}
      <EventItemPopover anchorEl={anchorEl} event={event} onTriggerViewer={triggerViewer} />
      <Popper
        open={!!dragTime}
        role="tooltip"
        anchorEl={dragHandleRef.current}
        sx={{ pointerEvents: "none" }}
      >
        <Typography variant="caption">
          {dragTime ? format(dragTime, hFormat, { locale }) : null}
        </Typography>
      </Popper>
    </Fragment>
  );
};

export default EventItem;
