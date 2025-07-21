import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { act, render } from "@testing-library/react";
import SourceViewer from ".";
import { GitHubApiProvider } from "../../context/GitHubApiProvider";
import { SourcesProvider } from "../../context/SourcesProvider";
import { SnackbarProvider } from "../../context/SnackbarProvider";

describe("RepoViewer", () => {
  it("renders without crashing", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <GitHubApiProvider>
          <SourcesProvider>
            <ThemeProvider theme={createTheme()}>
              <SnackbarProvider>
                <SourceViewer />
              </SnackbarProvider>
            </ThemeProvider>
          </SourcesProvider>
        </GitHubApiProvider>,
      );
    });
  });
});
