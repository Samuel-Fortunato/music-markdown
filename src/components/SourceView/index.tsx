import styled from "@emotion/styled";
import GitHubIcon from "@mui/icons-material/GitHub";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

import { useSources } from "../../context/SourcesProvider";
import AddSource from "./AddSource";

const DivRoot = styled("div")({
  flexGrow: 1,
  padding: 8,
});

export default function SourceViewer() {
  const { sources, deleteSource } = useSources();

  return (
    <DivRoot>
      <List>
        {sources.map((source) => {
          let href: string;

          switch (source.type) {
            case "github":
              href = `/repos/${source.path}/browser/${source.default_branch}`;
              break;
            case "local":
              href = "/";
              break;
            default:
              href = "/";
              break;
          }

          return (
            <ListItemButton
              key={`repo-item-${source.id}`}
              component={Link}
              to={href}
            >
              <ListItemAvatar>
                <Avatar>
                  {source.type === "github" ? <GitHubIcon /> : <FolderOpenIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={source.name} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Delete"
                  onClick={() => deleteSource(source)}
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          );
        })}
      </List>
      <AddSource />
    </DivRoot>
  );
}
