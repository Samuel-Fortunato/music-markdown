import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useSnackbar } from "../../context/SnackbarProvider";


import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { set } from "ace-builds-internal/config";

const StyledGrid = styled(Grid)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

interface AddSourceProps {
  handleAddSource: (type: string, path: string, name: string) => Promise<void>;
}

export default function AddSource({
  handleAddSource: handleAddSource,
}: AddSourceProps) {
  const [open, setOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  const { errorSnackbar } = useSnackbar();

  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState("github");
  const [localPath, setLocalPath] = useState("");

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setRepoName("");
    setRepoOwner("");
    setSourceName("");
    setLocalPath("");
    setSourceType("github");
  };

  const handleDialogAdd = async () => {
    let path = "";
    
    switch (sourceType) {
      case "github":
        path = `${repoOwner}/${repoName}`;
        break
      case "local":
        path = localPath;
        break
      default:
        errorSnackbar("Unknown source type");
        return;
    }
    
    try {
      await handleAddSource(sourceType, path, sourceName ? sourceName : path);
      handleDialogClose();
    } catch (err: any) {
      errorSnackbar(err.message);
    }
  };

  return (
    <StyledGrid
      container
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <Fab aria-label="Add" onClick={handleDialogOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} fullWidth aria-labelledby="add-source-dialog">
        <DialogTitle id="add-source-dialog-title">
          Add Source
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="sourceName"
            label="Name"
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
            fullWidth
            helperText="Leave empty for default"
          />

          <TabContext value={sourceType}>
            <TabList
              onChange={(e, newValue) => setSourceType(newValue)}
            >
              <Tab label="Github" value="github" />
              <Tab label="Local Folder" value="local" />
            </TabList>
            <TabPanel value="github">
              <TextField
          margin="dense"
          id="repoOwner"
          label="Repository Owner"
          value={repoOwner}
          onChange={(event) => setRepoOwner(event.target.value)}
          fullWidth
              />
              <TextField
          margin="dense"
          id="repoName"
          label="Repository Name"
          value={repoName}
          onChange={(event) => setRepoName(event.target.value)}
          fullWidth
              />
            </TabPanel>
            <TabPanel value="local">
              <TextField
          margin="dense"
          id="localPath"
          label="Path"
          value={localPath}
          onChange={(event) => setLocalPath(event.target.value)}
          fullWidth
              />
            </TabPanel>
          </TabContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </StyledGrid>
  );
}
