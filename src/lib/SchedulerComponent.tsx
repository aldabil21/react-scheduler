import { Week } from "./views/Week";
import { Navigation } from "./components/nav/Navigation";
import { useAppState } from "./hooks/useAppState";
import Editor from "./views/Editor";
import { CircularProgress, Typography } from "@mui/material";
import { Month } from "./views/Month";
import { Day } from "./views/Day";
import { Table, Wrapper } from "./styles/styles";
import { useMemo } from "react";

const SchedulerComponent = () => {
  const { loading, view, dialog, resources, resourceViewMode } = useAppState();

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
    <Wrapper>
      {loading && (
        <div className="rs__table_loading">
          <span>
            <CircularProgress size={50} />
            <Typography align="center">Loading...</Typography>
          </span>
        </div>
      )}
      <Navigation />
      <div className="rs__outer_table">
        <Table
          resource_count={resourceViewMode === "tabs" ? 1 : resources.length}
        >
          {Views}
        </Table>
      </div>
      {dialog && <Editor />}
    </Wrapper>
  );
};

export { SchedulerComponent };
