import { Fragment, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { addMinutes, differenceInMinutes } from "date-fns";
import { EditorDatePicker } from "../components/inputs/DatePicker";
import { EditorInput } from "../components/inputs/Input";
import {
  EventActions,
  FieldInputProps,
  FieldProps,
  InputTypes,
  ProcessedEvent,
  SchedulerHelpers,
} from "../types";
import { EditorSelect } from "../components/inputs/SelectInput";
import { arraytizeFieldVal } from "../helpers/generals";
import { SelectedRange } from "../store/types";
import useStore from "../hooks/useStore";

export type StateItem = {
  value: any;
  validity: boolean;
  type: InputTypes;
  config?: FieldInputProps;
};

export type StateEvent = (ProcessedEvent & SelectedRange) | Record<string, any>;

const initialState = (fields: FieldProps[], event?: StateEvent): Record<string, StateItem> => {
  const customFields = {} as Record<string, StateItem>;
  for (const field of fields) {
    const defVal = arraytizeFieldVal(field, field.default, event);
    const eveVal = arraytizeFieldVal(field, event?.[field.name], event);

    customFields[field.name] = {
      value: eveVal.value || defVal.value || "",
      validity: field.config?.required ? !!eveVal.validity || !!defVal.validity : true,
      type: field.type,
      config: field.config,
    };
  }

  return {
    event_id: {
      value: event?.event_id || null,
      validity: true,
      type: "hidden",
    },
    title: {
      value: event?.title || "",
      validity: !!event?.title,
      type: "input",
      config: { label: "Title", required: true, min: 3 },
    },
    start: {
      value: event?.start || new Date(),
      validity: true,
      type: "date",
      config: { label: "Start", sm: 6 },
    },
    end: {
      value: event?.end || new Date(),
      validity: true,
      type: "date",
      config: { label: "End", sm: 6 },
    },
    ...customFields,
  };
};

const Editor = () => {
  const {
    fields,
    dialog,
    triggerDialog,
    selectedRange,
    selectedEvent,
    triggerLoading,
    onConfirm,
    customEditor,
    confirmEvent,
    dialogMaxWidth,
    translations,
  } = useStore();
  const [state, setState] = useState(initialState(fields, selectedEvent || selectedRange));
  const [touched, setTouched] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEditorState = (name: string, value: any, validity: boolean) => {
    setState((prev) => {
      return {
        ...prev,
        [name]: { ...prev[name], value, validity },
      };
    });
  };

  const handleClose = (clearState?: boolean) => {
    if (clearState) {
      setState(initialState(fields));
    }
    triggerDialog(false);
  };

  const handleConfirm = async () => {
    let body = {} as ProcessedEvent;
    for (const key in state) {
      body[key] = state[key].value;
      if (!customEditor && !state[key].validity) {
        return setTouched(true);
      }
    }
    try {
      triggerLoading(true);
      // Auto fix date
      body.end =
        body.start >= body.end
          ? addMinutes(body.start, differenceInMinutes(selectedRange?.end!, selectedRange?.start!))
          : body.end;
      // Specify action
      const action: EventActions = selectedEvent?.event_id ? "edit" : "create";
      // Trigger custom/remote when provided
      if (onConfirm) {
        body = await onConfirm(body, action);
      } else {
        // Create/Edit local data
        body.event_id =
          selectedEvent?.event_id || Date.now().toString(36) + Math.random().toString(36).slice(2);
      }
      confirmEvent(body, action);
      handleClose(true);
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };
  const renderInputs = (key: string) => {
    const stateItem = state[key];
    switch (stateItem.type) {
      case "input":
        return (
          <EditorInput
            value={stateItem.value}
            name={key}
            onChange={handleEditorState}
            touched={touched}
            {...stateItem.config}
            label={translations.event[key] || stateItem.config?.label}
          />
        );
      case "date":
        return (
          <EditorDatePicker
            value={stateItem.value}
            name={key}
            onChange={(...args) => handleEditorState(...args, true)}
            {...stateItem.config}
            label={translations.event[key] || stateItem.config?.label}
          />
        );
      case "select":
        const field = fields.find((f) => f.name === key);
        return (
          <EditorSelect
            value={stateItem.value}
            name={key}
            options={field?.options || []}
            onChange={handleEditorState}
            touched={touched}
            {...stateItem.config}
            label={translations.event[key] || stateItem.config?.label}
          />
        );
      default:
        return "";
    }
  };

  const renderEditor = () => {
    if (customEditor) {
      const schedulerHelpers: SchedulerHelpers = {
        state,
        close: () => triggerDialog(false),
        loading: (load) => triggerLoading(load),
        edited: selectedEvent,
        onConfirm: confirmEvent,
      };
      return customEditor(schedulerHelpers);
    }
    return (
      <Fragment>
        <DialogTitle>
          {selectedEvent ? translations.form.editTitle : translations.form.addTitle}
        </DialogTitle>
        <DialogContent style={{ overflowX: "hidden" }}>
          <Grid container spacing={2}>
            {Object.keys(state).map((key) => {
              const item = state[key];
              return (
                <Grid item key={key} sm={item.config?.sm} xs={12}>
                  {renderInputs(key)}
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth onClick={() => handleClose()}>
            {translations.form.cancel}
          </Button>
          <Button color="primary" fullWidth onClick={handleConfirm}>
            {translations.form.confirm}
          </Button>
        </DialogActions>
      </Fragment>
    );
  };

  return (
    <Dialog open={dialog} fullScreen={isMobile} maxWidth={dialogMaxWidth}>
      {renderEditor()}
    </Dialog>
  );
};

export default Editor;
