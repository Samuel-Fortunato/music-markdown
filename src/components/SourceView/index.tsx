import styled from "@emotion/styled";
import List from "@mui/material/List";

import { useSources } from "../../context/SourcesProvider";
import AddSource from "./AddSource";
import SourcesListItem from "./SourceListItem";

const DivRoot = styled("div")({
  flexGrow: 1,
  padding: 8,
});

export default function SourceViewer() {
  const { sources } = useSources();

  return (
    <DivRoot>
      <List>
        {sources.map((source) => {
          return <SourcesListItem key={source.id} source={source} />;
        })}
      </List>
      <AddSource />
    </DivRoot>
  );
}
