import { Fragment, MouseEvent, useMemo, useState } from "react";
import { Popover, Typography, ButtonBase, useTheme, IconButton, Box } from "@mui/material";
import { format } from "date-fns";
import { ProcessedEvent } from "../../types";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import { EventItemPaper, PopperInner } from "../../styles/styles";
import EventActions from "./Actions";
import { differenceInDaysOmitTime } from "../../helpers/generals";
import useStore from "../../hooks/useStore";
import useDragAttributes from "../../hooks/useDragAttributes";

interface EventItemProps {
  event: ProcessedEvent;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const EventItem = ({ event, multiday, hasPrev, hasNext, showdate = true }: EventItemProps) => {
  const {
    triggerDialog,
    onDelete,
    events,
    handleState,
    triggerLoading,
    customViewer,
    viewerExtraComponent,
    fields,
    direction,
    resources,
    resourceFields,
    locale,
    viewerTitleComponent,
    hourFormat,
    eventRenderer,
    onEventClick,
    view,
    draggable,
    translations,
    editable,
  } = useStore();
  const dragProps = useDragAttributes(event);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = hourFormat === "12" ? "hh:mm a" : "HH:mm";

  const NextArrow = direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;
  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;

  const triggerViewer = (el?: MouseEvent<Element>) => {
    if (!el?.currentTarget && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el?.currentTarget || null);
  };

  const handleDelete = async () => {
    try {
      triggerLoading(true);
      let deletedId = event.event_id;
      // Trigger custom/remote when provided
      if (onDelete) {
        const remoteId = await onDelete(deletedId);
        if (remoteId) {
          deletedId = remoteId;
        } else {
          deletedId = "";
        }
      }
      if (deletedId) {
        triggerViewer();
        const updatedEvents = events.filter((e) => e.event_id !== deletedId);
        handleState(updatedEvents, "events");
      }
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };

  const renderViewer = () => {
    const idKey = resourceFields.idField;
    const hasResource = resources.filter((res) =>
      Array.isArray(event[idKey]) ? event[idKey].includes(res[idKey]) : res[idKey] === event[idKey]
    );

    return (
      <PopperInner>
        <Box
          sx={{
            bgcolor: event.color || theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <div className="rs__popper_actions">
            <div>
              <IconButton
                size="small"
                onClick={() => {
                  triggerViewer();
                }}
              >
                <ClearRoundedIcon color="disabled" />
              </IconButton>
            </div>
            <EventActions
              event={event}
              onDelete={handleDelete}
              onEdit={() => {
                triggerViewer();
                triggerDialog(true, event);
              }}
            />
          </div>
          {viewerTitleComponent instanceof Function ? (
            viewerTitleComponent(event)
          ) : (
            <Typography style={{ padding: "5px 0" }} noWrap>
              {event.title}
            </Typography>
          )}
        </Box>
        <div style={{ padding: "5px 10px" }}>
          <Typography
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            color="textSecondary"
            variant="caption"
            noWrap
          >
            <EventNoteRoundedIcon />
            {hideDates
              ? translations.event.allDay
              : `${format(event.start, `dd MMMM yyyy ${hFormat}`, {
                  locale: locale,
                })} - ${format(event.end, `dd MMMM yyyy ${hFormat}`, {
                  locale: locale,
                })}`}
          </Typography>
          {hasResource.length > 0 && (
            <Typography
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              color="textSecondary"
              variant="caption"
              noWrap
            >
              <SupervisorAccountRoundedIcon />
              {hasResource.map((res) => res[resourceFields.textField]).join(", ")}
            </Typography>
          )}
          {viewerExtraComponent instanceof Function
            ? viewerExtraComponent(fields, event)
            : viewerExtraComponent}
        </div>
      </PopperInner>
    );
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
          disabled={event.disabled}
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
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          triggerViewer();
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {typeof customViewer === "function"
          ? customViewer(event, () => triggerViewer())
          : renderViewer()}
      </Popover>
    </Fragment>
  );
};

export default EventItem;
