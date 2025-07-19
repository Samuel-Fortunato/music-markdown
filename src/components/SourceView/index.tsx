import styled from "@emotion/styled";
import BookIcon from "@mui/icons-material/Book";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { /* useSourceMetadata, */ useSources } from "../../context/SourcesProvider";
import AddSource from "./AddSource";

const DivRoot = styled("div")({
  flexGrow: 1,
  padding: 8,
});

export default function RepoViewer() {
  const { sources, addSource, deleteSource } = useSources();

  return (
    <DivRoot>
      <List>
        {sources.map((source) => (
          <ListItem
            button
            key={`repo-item-${source.name}`}
            component={Link}
            to={`/repos/${source.path}/browser/${source.default_branch}`}
          >
            <ListItemAvatar>
              <Avatar>
                <BookIcon />
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
          </ListItem>
        ))}
      </List>
      <AddSource handleAddSource={addSource} />
    </DivRoot>
  );
}
