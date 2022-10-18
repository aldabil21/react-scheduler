import DeleteRounded from "@mui/icons-material/DeleteRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { Button, Grow, IconButton, Slide } from "@mui/material";
import { useMemo, useState } from "react";
import { useAppState } from "../../hooks/useAppState";
import { EventActions as Actions } from "../../styles/styles";
import { ProcessedEvent } from "../../types";

interface Props {
  event: ProcessedEvent;
  onDelete(): void;
  onEdit(): void;
  direction: "rtl" | "ltr";
  editable?: boolean;
  deletable?: boolean;
}

const EventActions = ({ event, onDelete, onEdit, direction, editable, deletable }: Props) => {
  const { translations } = useAppState();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!deleteConfirm) {
      return setDeleteConfirm(true);
    }
    onDelete();
  };

  const canDelete = useMemo(() => {
    // Priority control to event specific deletable value
    if (typeof event.deletable !== "undefined") {
      return event.deletable;
    }
    return deletable;
  }, [deletable, event.deletable]);

  const canEdit = useMemo(() => {
    // Priority control to event specific deletable value
    if (typeof event.editable !== "undefined") {
      return event.editable;
    }
    return editable;
  }, [editable, event.editable]);

  return (
    <Actions>
      <Grow in={!deleteConfirm} exit={false} timeout={400} unmountOnExit>
        <div>
          {canEdit && (
            <IconButton size="small" onClick={onEdit}>
              <EditRounded />
            </IconButton>
          )}
          {canDelete && (
            <IconButton size="small" onClick={handleDelete}>
              <DeleteRounded />
            </IconButton>
          )}
        </div>
      </Grow>
      <Slide
        in={deleteConfirm}
        direction={direction === "rtl" ? "right" : "left"}
        unmountOnExit
        timeout={400}
        exit={false}
      >
        <div>
          <Button className="delete" size="small" onClick={handleDelete}>
            {translations.form.delete.toUpperCase()}
          </Button>
          <Button className="cancel" size="small" onClick={() => setDeleteConfirm(false)}>
            {translations.form.cancel.toUpperCase()}
          </Button>
        </div>
      </Slide>
    </Actions>
  );
};

export default EventActions;
