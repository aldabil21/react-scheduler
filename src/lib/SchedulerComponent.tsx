import { Week } from "./views/Week";
import "./assets/css/index.css";
import { Navigation } from "./components/nav/Navigation";
import { useAppState } from "./hooks/useAppState";
import Editor from "./views/Editor";
import { CircularProgress } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Month } from "./views/Month";
import { Day } from "./views/Day";

const SchedulerComponent = () => {
  const { loading, view, dialog, direction } = useAppState();

  const renderViews = () => {
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
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {loading && (
        <div className="table_loading">
          <div className="progress_loading">
            <CircularProgress size={50} />
            <Typography align="center">Loading...</Typography>
          </div>
        </div>
      )}
      <Navigation />
      <div className="outer-table">
        <table>
          <style>
            {`
              table td {
                border-${
                  direction === "rtl" ? "right" : "left"
                }: 1px solid #eeeeee;
              }
            `}
          </style>
          {renderViews()}
        </table>
      </div>
      {dialog && <Editor />}
    </div>
  );
};

export { SchedulerComponent };
