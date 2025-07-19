import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GitHubApiProvider } from "../context/GitHubApiProvider";
import { SourcesProvider } from "../context/SourcesProvider";
import { SnackbarProvider } from "../context/SnackbarProvider";
import { SongPrefsProvider } from "../context/SongPrefsProvider";
import { ThemeProvider } from "../context/ThemeProvider";
import { YouTubeIdProvider } from "../context/YouTubeIdProvider";
import { REPO_REGEX } from "../lib/constants";
import AppBar from "./AppBar";
import BranchViewer from "./BranchView";
import FileViewer from "./FileView";
import Edit from "./MusicMd/Edit";
import View from "./MusicMd/View";
import RepoViewer from "./SourceView";

const App = () => (
  <YouTubeIdProvider>
    <SongPrefsProvider>
      <GitHubApiProvider>
        <SourcesProvider>
          <ThemeProvider>
            <SnackbarProvider>
              <HomeRouter />
            </SnackbarProvider>
          </ThemeProvider>
        </SourcesProvider>
      </GitHubApiProvider>
    </SongPrefsProvider>
  </YouTubeIdProvider>
);

const HomeRouter = () => (
  <Router key="home-router">
    <Route>
      <AppBar />
    </Route>
    <Switch>
      <Route path={`${REPO_REGEX}/viewer/:branch/:path+`}>
        <View />
      </Route>
      <Route path={`${REPO_REGEX}/browser/:branch/:path*`}>
        <FileViewer />
      </Route>
      <Route path={`${REPO_REGEX}/editor/:branch/:path*`}>
        <Edit />
      </Route>
      <Route path={REPO_REGEX}>
        <BranchViewer />
      </Route>
      <Route path="/">
        <RepoViewer />
      </Route>
    </Switch>
  </Router>
);

export default App;
