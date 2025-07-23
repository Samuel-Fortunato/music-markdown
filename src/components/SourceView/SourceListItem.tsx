import GitHubIcon from "@mui/icons-material/GitHub";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { Source, useSources } from "../../context/SourcesProvider";

interface SourceListItemProps {
    source: Source;
}

export default function SourceListItem({ source }: SourceListItemProps) {
    const { deleteSource } = useSources();

    let link: string;
    switch (source.type) {
        case "github":
            link = `/repos/${source.path}/browser/${source.default_branch}`;
            break;
        case "local":
            link = "/";
            break;
        default:
            link = "/";
            break;
    }

    return (
        <ListItemButton
            key={`repo-item-${source.id}`}
            component={Link}
            to={link}
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
}