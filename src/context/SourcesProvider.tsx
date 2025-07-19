import { createContext, FC, useContext, useEffect, useState } from "react";
import { getRepoMetadata, RepoMetadata, verifyRepoExists } from "../lib/github";
import { useLocalStorage } from "../lib/hooks";
import { useGitHubApi } from "./GitHubApiProvider";

interface Source {
  type: string;
  path: string;
  name: string;
  default_branch: string;
}

interface SourcesContextValue {
  sources: Source[];
  setSources: (sources: Source[]) => void;
  addSource: (type: string, path: string, name: string) => Promise<void>;
  deleteSource: (source: Source) => void;
}

const SourcesContext = createContext<SourcesContextValue>({
  sources: [],
  setSources: () => {},
  addSource: () => Promise.resolve(),
  deleteSource: () => {},
});

export const useSources = () => useContext(SourcesContext);

/* export function useSourceMetadata() {
  const [sourceMetadata, setsourceMetadata] = useState<SourceMetadata[]>([]);
  const { sources } = useSources();
  const { gitHubToken } = useGitHubApi();

  useEffect(() => {
    const fetchData = async () => {
      sources.map((source) => {
        const sourceMetadata = await getRepoMetadata(source, { gitHubToken });
        setsourceMetadata(sourceMetadata);
      }
    };
    fetchData();
  }, [sources, gitHubToken]);

  return sourceMetadata;
} */

interface SourcesProviderProps {
  children: React.ReactNode;
}

export const SourcesProvider: FC<SourcesProviderProps> = ({ children }) => {
  const [sources, setSources] = useLocalStorage<Source[]>("sources", []);
  const { gitHubToken } = useGitHubApi();

  const addSource = async (type: string, path: string, name: string) => {
    if (sources.some((s) => {s.type === type && s.path === path})) {
      throw new Error(`"${path}" is already registered.`);
    }

    switch (type) {
      case "github":
        await verifyRepoExists(path, { gitHubToken });
        const default_branch = (await getRepoMetadata(path, { gitHubToken })).default_branch;
        
        const newSource: Source = {
          type,
          path,
          name,
          default_branch: default_branch,
        };
        setSources([...sources, newSource]);
        break;
      
      case "local":
        // TODO - Add local sources
        // setSources([...sources, newSource]);
        break;
      default:
        throw new Error(`Unsupported source type: "${type}"`);
    }
  };

  const deleteSource = (source: Source) => {
    setSources(sources.filter((r) => r !== source));
  };

  return (
    <SourcesContext.Provider value={{ sources, setSources, addSource, deleteSource }}>
      {children}
    </SourcesContext.Provider>
  );
};
