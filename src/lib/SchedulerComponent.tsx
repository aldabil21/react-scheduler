import { Week } from "./views/Week";
import { Navigation } from "./components/nav/Navigation";
import { useAppState } from "./hooks/useAppState";
import Editor from "./views/Editor";
import { CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Month } from "./views/Month";
import { Day } from "./views/Day";
import CSS from "./assets/css/styles.module.css";

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
        <div className={CSS.table_loading}>
          <div className={CSS.progress_loading}>
            <CircularProgress size={50} />
            <Typography align="center">Loading...</Typography>
          </div>
        </div>
      )}
      <Navigation />
      <div className={CSS.outerTable}>
        <table className={`${CSS.table} ${CSS[`table_${direction}`]}`}>
          {renderViews()}
        </table>
      </div>
      {dialog && <Editor />}
    </div>
  );
};

export { SchedulerComponent };
