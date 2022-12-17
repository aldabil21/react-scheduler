import { ReactChild, useMemo } from "react";
import { DefaultRecourse } from "../../types";
import { ResourceHeader } from "./ResourceHeader";
import { ButtonTabProps, ButtonTabs } from "./Tabs";
import { useStore } from "../../store";

interface WithResourcesProps {
  renderChildren(resource: DefaultRecourse): ReactChild;
}
const WithResources = ({ renderChildren }: WithResourcesProps) => {
  const { resourceViewMode } = useStore();

  if (resourceViewMode === "tabs") {
    return <ResourcesTabTables renderChildren={renderChildren} />;
  } else {
    return <ResourcesTables renderChildren={renderChildren} />;
  }
};

const ResourcesTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields } = useStore();

  return (
    <>
      {resources.map((res: DefaultRecourse, i: number) => (
        <div key={`${res[resourceFields.idField]}_${i}`}>
          <ResourceHeader resource={res} />
          {renderChildren(res)}
        </div>
      ))}
    </>
  );
};

const ResourcesTabTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, selectedResource, handleState } = useStore();

  const tabs: ButtonTabProps[] = resources.map((res) => {
    return {
      id: res[resourceFields.idField],
      label: <ResourceHeader resource={res} />,
      component: <>{renderChildren(res)}</>,
    };
  });

  const setTab = (tab: DefaultRecourse["assignee"]) => {
    handleState(tab, "selectedResource");
  };

  const currentTabSafeId = useMemo(() => {
    const firstId = resources[0][resourceFields.idField];
    if (!selectedResource) {
      return firstId;
    }
    // Make sure current selected id is within the resources array
    const idx = resources.findIndex((re) => re[resourceFields.idField] === selectedResource);
    if (idx < 0) {
      return firstId;
    }

    return selectedResource;
  }, [resources, selectedResource, resourceFields.idField]);

  return (
    <ButtonTabs tabs={tabs} tab={currentTabSafeId} setTab={setTab} style={{ display: "grid" }} />
  );
};
WithResources.defaultProps = {
  span: 1,
};

export { WithResources };
