import { Fragment, useState } from "react";
import {
  Popover,
  Typography,
  ButtonBase,
  useTheme,
  IconButton,
  Button,
  Slide,
} from "@material-ui/core";
import { format } from "date-fns";
import { ProcessedEvent } from "../../Scheduler";
import { useAppState } from "../../hooks/useAppState";
import ArrowRightRoundedIcon from "@material-ui/icons/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@material-ui/icons/ArrowLeftRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EventNoteRoundedIcon from "@material-ui/icons/EventNoteRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";

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
        deletedId = await onDelete(deletedId);
      }
      triggerViewer();
      const updatedEvents = events.filter((e) => e.event_id !== deletedId);
      handleState(updatedEvents, "events");
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
          width: "100%",
        }}
      >
        <Typography style={{ fontSize: 11 }} noWrap>
          {hasPrev ? (
            <PrevArrow fontSize="small" style={{ display: "flex" }} />
          ) : (
            showdate && format(event.start, "hh:mm a", { locale: locale })
          )}
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          style={{ fontSize: 12 }}
          noWrap
        >
          {event.title}
        </Typography>
        <Typography style={{ fontSize: 11 }} noWrap>
          {hasNext ? (
            <NextArrow fontSize="small" style={{ display: "flex" }} />
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
      <div className="cal__popper">
        <div
          style={{
            background: event.color || theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
          className="popper__p"
        >
          <div className="popper__actions">
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
          <Typography style={{ padding: "5px 0" }} noWrap>
            {event.title}
          </Typography>
        </div>
        <div className="popper__p">
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
      </div>
    );
  };

  return (
    <Fragment>
      <ButtonBase
        onClick={(e) => {
          e.stopPropagation();
          triggerViewer(e.currentTarget);
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        {item}
        {/* <div style={{ height: "100%", textAlign: "start" }}>{item}</div> */}
      </ButtonBase>

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
