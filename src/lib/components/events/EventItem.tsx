import { Fragment, useMemo, useState } from "react";
import { Popover, Typography, ButtonBase, useTheme, IconButton, Paper } from "@mui/material";
import { format } from "date-fns";
import { ProcessedEvent } from "../../types";
import { useAppState } from "../../hooks/useAppState";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import { PopperInner } from "../../styles/styles";
import EventActions from "./Actions";

interface EventItemProps {
  event: ProcessedEvent;
  multiday: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const EventItem = ({ event, multiday, hasPrev, hasNext, showdate }: EventItemProps) => {
  const {
    triggerDialog,
    onDelete,
    events,
    handleState,
    triggerLoading,
    viewerExtraComponent,
    fields,
    direction,
    resources,
    resourceFields,
    locale,
    viewerTitleComponent,
    editable,
    deletable,
    hourFormat,
    eventRenderer,
    view,
    draggable,
  } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = hourFormat === "12" ? "hh:mm a" : "HH:mm";

  const NextArrow = direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;

  const triggerViewer = (el?: Element) => {
    if (!el && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el || null);
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
        const updatedEvents = events.filter((e) => e.event_id !== deletedId);
        handleState(updatedEvents, "events");
        triggerViewer();
      }
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };

  let item = (
    <div style={{ padding: 2 }}>
      <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
        {event.title}
      </Typography>
      {showdate && (
        <Typography style={{ fontSize: 11 }} noWrap>
          {`${format(event.start, hFormat, {
            locale: locale,
          })} - ${format(event.end, hFormat, { locale: locale })}`}
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
            showdate && format(event.start, hFormat, { locale: locale })
          )}
        </Typography>
        <Typography variant="subtitle2" align="center" sx={{ fontSize: 12 }} noWrap>
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: 11 }} noWrap>
          {hasNext ? (
            <NextArrow fontSize="small" sx={{ display: "flex" }} />
          ) : (
            showdate && format(event.end, hFormat, { locale: locale })
          )}
        </Typography>
      </div>
    );
  }

  const renderViewer = () => {
    const idKey = resourceFields.idField;
    const hasResource = resources.filter((res) =>
      Array.isArray(event[idKey]) ? event[idKey].includes(res[idKey]) : res[idKey] === event[idKey]
    );

    return (
      <PopperInner>
        <div
          style={{
            background: event.color || theme.palette.primary.main,
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
              direction={direction}
              deletable={deletable}
              editable={editable}
            />
          </div>
          {viewerTitleComponent instanceof Function ? (
            viewerTitleComponent(event)
          ) : (
            <Typography style={{ padding: "5px 0" }} noWrap>
              {event.title}
            </Typography>
          )}
        </div>
        <div style={{ padding: "5px 10px" }}>
          <Typography
            style={{ display: "flex", alignItems: "center" }}
            color="textSecondary"
            variant="caption"
            noWrap
          >
            <EventNoteRoundedIcon />{" "}
            {`${format(event.start, `dd MMMM yyyy ${hFormat}`, {
              locale: locale,
            })} - ${format(event.end, `dd MMMM yyyy ${hFormat}`, {
              locale: locale,
            })}`}
          </Typography>
          {hasResource.length > 0 && (
            <Typography
              style={{ display: "flex", alignItems: "center" }}
              color="textSecondary"
              variant="caption"
              noWrap
            >
              <SupervisorAccountRoundedIcon />{" "}
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

  const renderEvent = useMemo(() => {
    // Check if has custom render event method
    // only applicable to non-multiday events and not in month-view
    let ev = item;
    if (typeof eventRenderer === "function" && !multiday && view !== "month") {
      const custom = eventRenderer(event);
      if (custom) {
        ev = custom;
      }
    }
    return ev;
  }, []);
  const disabledDrag = event.disabledDragAndDrop || draggable;
  return (
    <Fragment>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: event.disabled ? "#d0d0d0" : event.color || theme.palette.primary.main,
          color: event.disabled ? "#808080" : theme.palette.primary.contrastText,
          cursor: event.disabled ? "not-allowed" : "pointer",
          overflow: "hidden",
        }}
      >
        <ButtonBase
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerViewer(e.currentTarget);
          }}
          disabled={event.disabled}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          {/* <div
            style={{
              height: "100%",
            }}
            draggable
            onDragStart={(e) => {
              console.log("onDragStart");

              e.stopPropagation();
              e.dataTransfer.setData("text/plain", `${event.event_id}`);
              e.currentTarget.style.backgroundColor = theme.palette.error.main;
            }}
            onDragEnd={(e) => {
              console.log("onDragEnd");
              e.currentTarget.style.backgroundColor = event.color || theme.palette.primary.main;
            }}
            onDragOver={(e) => {
              console.log("onDragOver");
              e.stopPropagation();
              e.preventDefault();
            }}
            onDragEnter={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {renderEvent}
          </div> */}

          {disabledDrag ? (
            <>{renderEvent}</>
          ) : (
            <div
              style={{
                height: "100%",
              }}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                e.dataTransfer.setData("text/plain", `${event.event_id}`);
                e.currentTarget.style.backgroundColor = theme.palette.error.main;
              }}
              onDragEnd={(e) => {
                e.currentTarget.style.backgroundColor = event.color || theme.palette.primary.main;
              }}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDragEnter={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {renderEvent}
            </div>
          )}
        </ButtonBase>
      </Paper>

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
        {renderViewer()}
      </Popover>
    </Fragment>
  );
};

EventItem.defaultProps = {
  multiday: false,
  showdate: true,
};

export default EventItem;
