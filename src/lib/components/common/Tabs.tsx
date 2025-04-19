import { CSSProperties } from "react";
import { Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/system";

interface TabPanelProps {
  value: string | number;
  index: string | number;
  children: React.ReactNode;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return value === index ? <>{children}</> : <></>;
}

function a11yProps(index: string | number) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const StyledTaps = styled("div")(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  alignSelf: "center",
  "& .tabs": {
    borderColor: theme.palette.grey[300],
    borderStyle: "solid",
    borderWidth: 1,
    "& button.MuiTab-root": {
      borderColor: theme.palette.grey[300],
      borderRightStyle: "solid",
      borderWidth: 1,
    },
  },
  "& .primary": {
    background: theme.palette.primary.main,
  },
  "& .secondary": {
    background: theme.palette.secondary.main,
  },
  "& .error": {
    background: theme.palette.error.main,
  },
  "& .info": {
    background: theme.palette.info.dark,
  },
  "& .text_primary": {
    color: theme.palette.primary.main,
  },
  "& .text_secondary": {
    color: theme.palette.secondary.main,
  },
  "& .text_error": {
    color: theme.palette.error.main,
  },
  "& .text_info": {
    color: theme.palette.info.dark,
  },
}));

export type ButtonTabProps = {
  id: string | number;
  label: string | React.ReactNode;
  component: React.ReactNode;
};
interface ButtonTabsProps {
  tabs: ButtonTabProps[];
  tab: string | number;
  setTab(tab: string | number): void;
  variant?: "scrollable" | "standard" | "fullWidth";
  indicator?: "primary" | "secondary" | "info" | "error";
  style?: CSSProperties;
}

const ButtonTabs = ({
  tabs,
  variant = "scrollable",
  tab,
  setTab,
  indicator = "primary",
  style,
}: ButtonTabsProps) => {
  return (
    <StyledTaps style={style}>
      <Tabs
        value={tab}
        variant={variant}
        scrollButtons
        className="tabs"
        classes={{ indicator: indicator }}
      >
        {tabs.map((tab: ButtonTabProps, i: number) => (
          <Tab
            key={tab.id || i}
            label={tab.label}
            sx={{ flex: 1, flexBasis: 200, flexShrink: 0 }}
            value={tab.id}
            {...a11yProps(tab.id)}
            onClick={() => setTab(tab.id)}
            onDragEnter={() => setTab(tab.id)}
          />
        ))}
      </Tabs>
      {tabs.map(
        (t: ButtonTabProps, i: number) =>
          t.component && (
            <TabPanel key={i} value={tab} index={t.id}>
              {t.component}
            </TabPanel>
          )
      )}
    </StyledTaps>
  );
};

export { ButtonTabs };
