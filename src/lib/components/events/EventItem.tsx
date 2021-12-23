import { Fragment, useState } from "react";
import {
  Popover,
  Typography,
  ButtonBase,
  useTheme,
  IconButton,
  Button,
  Slide,
  Paper,
} from "@mui/material";
import { format } from "date-fns";
import { ProcessedEvent } from "../../types";
import { useAppState } from "../../hooks/useAppState";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import { PopperInner } from "../../styles/styles";

interface EventItemProps {
  event: ProcessedEvent;
  multiday: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const EventItem = ({
  event,
  multiday,
  hasPrev,
  hasNext,
  showdate,
}: EventItemProps) => {
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
  } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();

  const NextArrow =
    direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow =
    direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;

  const triggerViewer = (el?: Element) => {
    if (!el && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el || null);
  };

  const handleConfirmDelete = async () => {
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
          {`${format(event.start, "hh:mm a", {
            locale: locale,
          })} - ${format(event.end, "hh:mm a", { locale: locale })}`}
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
            showdate && format(event.start, "hh:mm a", { locale: locale })
          )}
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontSize: 12 }}
          noWrap
        >
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: 11 }} noWrap>
          {hasNext ? (
            <NextArrow fontSize="small" sx={{ display: "flex" }} />
          ) : (
            showdate && format(event.end, "hh:mm a", { locale: locale })
          )}
        </Typography>
      </div>
    );
  }

  const renderViewer = () => {
    const idKey = resourceFields.idField;
    const hasResource = resources.filter((res) =>
      Array.isArray(event[idKey])
        ? event[idKey].includes(res[idKey])
        : res[idKey] === event[idKey]
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
                style={{ color: theme.palette.primary.contrastText }}
                onClick={() => {
                  triggerViewer();
                }}
              >
                <ClearRoundedIcon color="disabled" />
              </IconButton>
            </div>
            <div style={{ display: "inherit" }}>
              <IconButton
                size="small"
                style={{ color: theme.palette.primary.contrastText }}
                onClick={() => {
                  triggerViewer();
                  triggerDialog(true, event);
                }}
              >
                <EditRoundedIcon />
              </IconButton>
              {!deleteConfirm && (
                <IconButton
                  size="small"
                  style={{ color: theme.palette.primary.contrastText }}
                  onClick={() => setDeleteConfirm(true)}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              )}
              <Slide
                in={deleteConfirm}
                direction={direction === "rtl" ? "right" : "left"}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <Button
                    style={{ color: theme.palette.error.main }}
                    size="small"
                    onClick={handleConfirmDelete}
                  >
                    DELETE
                  </Button>
                  <Button
                    style={{ color: theme.palette.action.disabled }}
                    size="small"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    CANCEL
                  </Button>
                </div>
              </Slide>
            </div>
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
            {`${format(event.start, "dd MMMM yyyy hh:mm a", {
              locale: locale,
            })} - ${format(event.end, "dd MMMM yyyy hh:mm a", {
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
              {hasResource
                .map((res) => res[resourceFields.textField])
                .join(", ")}
            </Typography>
          )}
          {viewerExtraComponent instanceof Function
            ? viewerExtraComponent(fields, event)
            : viewerExtraComponent}
        </div>
      </PopperInner>
    );
  };

  return (
    <Fragment>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: event.disabled
            ? "#d0d0d0"
            : event.color || theme.palette.primary.main,
          color: event.disabled
            ? "#808080"
            : theme.palette.primary.contrastText,
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
              e.currentTarget.style.backgroundColor =
                event.color || theme.palette.primary.main;
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
            {item}
          </div>
        </ButtonBase>
      </Paper>

      {/* Viewer */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={(e) => {
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
