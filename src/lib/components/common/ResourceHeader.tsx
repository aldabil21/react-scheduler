import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useWindowResize } from "../../hooks/useWindowResize";
import { DefaultRecourse } from "../../types";
import useStore from "../../hooks/useStore";

interface ResourceHeaderProps {
  resource: DefaultRecourse;
}
const ResourceHeader = ({ resource }: ResourceHeaderProps) => {
  const { recourseHeaderComponent, resourceFields, resources, direction, resourceViewMode } =
    useStore();
  const { width } = useWindowResize();

  const text = resource[resourceFields.textField];
  const subtext = resource[resourceFields.subTextField || ""];
  const avatar = resource[resourceFields.avatarField || ""];
  const color = resource[resourceFields.colorField || ""];

  if (recourseHeaderComponent instanceof Function) {
    return recourseHeaderComponent(resource);
  }

  const headerBorders =
    resourceViewMode === "tabs"
      ? {}
      : {
          borderColor: "#eee",
          borderStyle: "solid",
          borderWidth: "1px 1px 0 1px",
        };
  return (
    <ListItem
      sx={{
        padding: "2px 10px",
        textAlign: direction === "rtl" ? "right" : "left",
        ...headerBorders,
      }}
      component="span"
    >
      <ListItemAvatar style={{ display: "flex", justifyContent: "center", minWidth: "45px" }}>
        <Avatar
          style={{ background: color, width: "35px", height: "35px", textTransform: "capitalize" }}
          alt={text}
          src={avatar}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="body2"
            style={{ fontSize: "0.65rem", textTransform: "capitalize" }}
            noWrap
          >
            {text}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            style={{ fontSize: "0.55rem", textTransform: "capitalize" }}
            color="textSecondary"
            noWrap
          >
            {subtext}
          </Typography>
        }
        style={{
          width: width / (resources.length + 1),
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      />
    </ListItem>
  );
};

export { ResourceHeader };
