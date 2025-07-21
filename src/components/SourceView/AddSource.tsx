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
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from "react";

import { useSnackbar } from "../../context/SnackbarProvider";
import { useSources } from "../../context/SourcesProvider";

const StyledGrid = styled(Grid)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

export default function AddSource() {
  const [open, setOpen] = useState(false);
  const { errorSnackbar } = useSnackbar();
  const { addSource } = useSources();

  const [name, setName] = useState("");
  const [sourceType, setSourceType] = useState("github");
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setRepoName("");
    setRepoOwner("");
    setName("");
    setSourceType("github");
  };

  const handleAddSource = async () => {
    let path = "";

    switch (sourceType) {
      case "github":
        path = `${repoOwner}/${repoName}`;
        break;
      case "local":
        break;
      default:
        errorSnackbar("Unknown source type");
        return;
    }
    
    try {
      await addSource({type: sourceType, name: name, path: path});
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
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            helperText="Leave empty for default"
          />
          <TabContext value={sourceType}>
            <TabList
              variant="fullWidth"
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
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAddSource}
              >
                Select Directory
              </Button>
            </TabPanel>
          </TabContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {sourceType != "local" && (
            <Button onClick={handleAddSource}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </StyledGrid>
  );
}
