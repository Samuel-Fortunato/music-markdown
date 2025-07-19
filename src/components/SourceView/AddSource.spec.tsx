import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { render } from "@testing-library/react";
import { SnackbarProvider } from "../../context/SnackbarProvider";
import AddSource from "./AddSource";

describe("AddRepository", () => {
  it("renders without crashing", () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <SnackbarProvider>
          <AddSource handleAddSource={async () => undefined} />
        </SnackbarProvider>
      </ThemeProvider>,
    );
  });
});
