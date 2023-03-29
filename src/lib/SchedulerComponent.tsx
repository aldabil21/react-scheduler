import { Week } from "./views/Week";
import { Navigation } from "./components/nav/Navigation";
import Editor from "./views/Editor";
import { CircularProgress, Typography } from "@mui/material";
import { Month } from "./views/Month";
import { Day } from "./views/Day";
import { Table, Wrapper } from "./styles/styles";
import { forwardRef, useMemo } from "react";
import useStore from "./hooks/useStore";
import { SchedulerRef } from "./types";

const SchedulerComponent = forwardRef<SchedulerRef, unknown>(function SchedulerComponent(_, ref) {
  const store = useStore();
  const { view, dialog, loading, resourceViewMode, resources, translations } = store;

  const Views = useMemo(() => {
    switch (view) {
      case "month":
        return <Month />;
      case "week":
        return <Week />;
      case "day":
        return <Day />;
      default:
        return "";
    }
  }, [view]);

  return (
    <Wrapper
      dialog={dialog ? 1 : 0}
      data-testid="rs-wrapper"
      ref={(el) => {
        const calendarRef = ref as any;
        if (calendarRef) {
          calendarRef.current = {
            el,
            scheduler: store,
          };
        }
      }}
    >
      {loading && (
        <div className="rs__table_loading">
          <span>
            <CircularProgress size={50} />
            <Typography align="center">{translations.loading}</Typography>
          </span>
        </div>
      )}
      <Navigation />
      <Table
        resource_count={resourceViewMode === "tabs" ? 1 : resources.length}
        // Temp resources/default `sticky` wontfix
        sx={{
          overflowX: resourceViewMode === "default" && resources.length > 1 ? "auto" : undefined,
        }}
        data-testid="grid"
      >
        {Views}
      </Table>
      {dialog && <Editor />}
    </Wrapper>
  );
});

export default SchedulerComponent;
