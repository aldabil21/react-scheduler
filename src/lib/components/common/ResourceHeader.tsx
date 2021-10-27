import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAppState } from "../../hooks/useAppState";
import { useWindowResize } from "../../hooks/useWindowResize";
import { DefaultRecourse } from "../../types";

interface ResourceHeaderProps {
  resource: DefaultRecourse;
}
const ResourceHeader = ({ resource }: ResourceHeaderProps) => {
  const { recourseHeaderComponent, resourceFields, resources, direction } =
    useAppState();
  const { width } = useWindowResize();

  const text = resource[resourceFields.textField];
  const subtext = resource[resourceFields.subTextField || ""];
  const avatar = resource[resourceFields.avatarField || ""];
  const color = resource[resourceFields.colorField || ""];

  if (recourseHeaderComponent instanceof Function) {
    return recourseHeaderComponent(resource);
  }

  return (
    <ListItem
      style={{
        padding: "2px 10px",
        textAlign: direction === "rtl" ? "right" : "left",
      }}
    >
      <ListItemAvatar>
        <Avatar style={{ background: color }} alt={text} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" noWrap>
            {text}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="textSecondary" noWrap>
            {subtext}
          </Typography>
        }
        style={{ width: width / (resources.length + 1) }}
      />
    </ListItem>
  );
};

export { ResourceHeader };
