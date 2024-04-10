import { render, screen } from "@testing-library/react";
import { Scheduler } from "..";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

describe("Render scheduler", () => {
  it("Default render", () => {
    render(<Scheduler dateAdapter={AdapterDateFns} />);

    // Scheduler component
    const scheduler = screen.getByTestId("rs-wrapper");
    expect(scheduler).toBeInTheDocument();

    // Navigators
    const viewNavigator = screen.getByTestId("view-navigator");
    expect(viewNavigator).toBeInTheDocument();

    const dateNavigator = screen.getByTestId("date-navigator");
    expect(dateNavigator).toBeInTheDocument();
    expect(dateNavigator.getElementsByTagName("button").length).toEqual(3);

    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
  });
});
