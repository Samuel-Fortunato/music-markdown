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

const StyledGrid = styled(Grid)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

interface AddRepositoryProps {
  handleAddRepository: (repo: string) => Promise<void>;
}

export default function AddRepository({
  handleAddRepository,
}: AddRepositoryProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const { errorSnackbar } = useSnackbar();

  const [sourceType, setSourceType] = useState("github");

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setName("");
    setOwner("");
  };

  const handleDialogAdd = async () => {
    try {
      await handleAddRepository(`${owner}/${name}`);
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
      <Dialog open={open} fullWidth aria-labelledby="add-repository-dialog">
        <DialogTitle id="add-repository-dialog-title">
          Add Repository
        </DialogTitle>
        <DialogContent>

          {/* <Tabs
            value={sourceType}
            onChange={(e, newValue) => setSourceType(newValue)}
          >
            <Tab label="GitHub" value="github" />
            <Tab label="Local Folder" value="local" />
          </Tabs>*/}


          <TabContext value={sourceType}>
            <TabList
              onChange={(e, newValue) => setSourceType(newValue)}
            >
              <Tab label="Github" value="github" />
              <Tab label="Local Folder" value="local" />
            </TabList>
            <TabPanel value="github">
              <TextField
                autoFocus
                margin="dense"
                id="owner"
                label="Repository Owner"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                fullWidth
              />
              <TextField
                margin="dense"
                id="name"
                label="Repository Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
              />
            </TabPanel>
            <TabPanel value="local">
              <TextField
                autoFocus
                margin="dense"
                id="file"
                label="direcroty"
                value=""
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
