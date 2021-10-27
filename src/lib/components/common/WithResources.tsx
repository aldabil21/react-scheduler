import { ReactChild } from "react";
import { useTheme } from "@mui/material";
import { useAppState } from "../../hooks/useAppState";
import { useWindowResize } from "../../hooks/useWindowResize";
import { DefaultRecourse } from "../../types";
import { ResourceHeader } from "./ResourceHeader";
import { ButtonTabProps, ButtonTabs } from "./Tabs";
import CSS from "../../assets/css/styles.module.css";

interface WithResourcesProps {
  span?: number;
  renderChildren(resource: DefaultRecourse): ReactChild;
}
const WithResources = ({ span, renderChildren }: WithResourcesProps) => {
  const { resourceViewMode } = useAppState();

  if (resourceViewMode === "tabs") {
    return <ResourcesTabTables renderChildren={renderChildren} />;
  } else {
    return <ResourcesTables renderChildren={renderChildren} span={span} />;
  }
};

const ResourcesTables = ({ span, renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, direction } = useAppState();
  const { width } = useWindowResize();
  const theme = useTheme();

  return (
    <tr>
      {resources.map((res: DefaultRecourse, i: number) => (
        <td key={`${res[resourceFields.idField]}_${i}`}>
          <table
            className={`${CSS.table} ${CSS[`table_${direction}`]}`}
            style={{
              width: width < theme.breakpoints.values.sm ? width : "100%",
            }}
          >
            <tbody className={CSS.noborder}>
              <tr>
                <td colSpan={span}>
                  <ResourceHeader resource={res} />
                </td>
              </tr>
            </tbody>
            <tbody>{renderChildren(res)}</tbody>
          </table>
        </td>
      ))}
    </tr>
  );
};

const ResourcesTabTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, selectedResource, handleState } =
    useAppState();

  const tabs: ButtonTabProps[] = resources.map((res) => {
    return {
      id: res[resourceFields.idField],
      label: <ResourceHeader resource={res} />,
      component: (
        <table className={CSS.table}>
          <tbody>{renderChildren(res)}</tbody>
        </table>
      ),
    };
  });

  const setTab = (tab: DefaultRecourse["assignee"]) => {
    handleState(tab, "selectedResource");
  };

  return (
    <tr>
      <td>
        <ButtonTabs
          tabs={tabs}
          tab={selectedResource || resources[0][resourceFields.idField]}
          setTab={setTab}
          style={{
            display: "grid",
          }}
        />
      </td>
    </tr>
  );
};
WithResources.defaultProps = {
  span: 1,
};

export { WithResources };
