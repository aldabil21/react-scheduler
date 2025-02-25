import { useMemo } from "react";
import { ProcessedEvent } from "../types";
import useStore from "./useStore";

type UseEventPermissions = {
  canEdit?: boolean;
  canDelete?: boolean;
  canDrag?: boolean;
  canResize?: boolean;
};

const useEventPermissions = (event: ProcessedEvent): UseEventPermissions => {
  const { editable, deletable, draggable, resizable } = useStore();

  const canEdit = useMemo(() => {
    // Priority control to event specific editable value
    if (typeof event.editable !== "undefined") {
      return event.editable;
    }
    return editable;
  }, [editable, event.editable]);

  const canDelete = useMemo(() => {
    // Priority control to event specific deletable value
    if (typeof event.deletable !== "undefined") {
      return event.deletable;
    }
    return deletable;
  }, [deletable, event.deletable]);

  const canDrag = useMemo(() => {
    if (!canEdit) {
      return;
    }
    // Priority control to event specific draggable value
    if (typeof event.draggable !== "undefined") {
      return event.draggable;
    }
    return draggable;
  }, [draggable, event.draggable, canEdit]);

  const canResize = useMemo(() => {
    if (!canEdit) {
      return;
    }
    // Priority control to event specific draggable value
    if (typeof event.resizable !== "undefined") {
      return event.resizable;
    }
    return resizable;
  }, [resizable, event.resizable, canEdit]);

  return {
    canEdit,
    canDelete,
    canDrag,
    canResize,
  };
};

export default useEventPermissions;
