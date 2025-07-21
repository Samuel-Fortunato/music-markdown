import { createContext, FC, useContext, useEffect, useState } from "react";
import { getRepoMetadata, RepoMetadata, verifyRepoExists } from "../lib/github";
import { useLocalStorage } from "../lib/hooks";
import { useGitHubApi } from "./GitHubApiProvider";

interface BaseSource {
  name: string;
}

interface GitHubSource extends BaseSource {
  type: "github";
  path: string;
  default_branch: string;
}

interface LocalSource extends BaseSource {
  type: "local";
  handle: FileSystemDirectoryHandle;
}

type Source = GitHubSource | LocalSource;

interface AddSourceArgs {
  type: "github" | "local";
  name?: string;
  path: string;
}

interface SourcesContextValue {
  sources: Source[];
  setSources: (sources: Source[]) => void;
  addSource: (args: AddSourceArgs) => Promise<void>;
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

  const addSource = async (args: AddSourceArgs) => {
    const { type, path, name } = args;

    console.debug("Adding source:", type, path, name);
    console.debug("Current sources:", sources);
    console.debug("Sources[] size:", sources.length);

    if (sources.some((s) => s.name === name)) {
      throw new Error(`Name "${name}" is already registered.`);
    }

    let newSource: Source;
    let newName: string;

    switch (type) {
      case "github":
        if (sources.some((s) => s.type === type && s.path === path)) {
          throw new Error(`"${path}" is already registered as a GitHub source.`);
        }
        await verifyRepoExists(path, { gitHubToken });
        const { default_branch } = await getRepoMetadata(path, { gitHubToken });
        newName = name ? name : path;
        newSource = {
          type,
          path,
          name: newName,
          default_branch,
        };
        setSources([...sources, newSource]);
        break;
      
      case "local":
        let handle: FileSystemDirectoryHandle;
        try {
          handle = await window.showDirectoryPicker();
        } catch (error: any) {
          if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Folder selection was cancelled.");
          }
          throw new Error(`Failed to select folder. ${error.message}`);
        }

        if (type === "local") {
          for (const s of sources) {
            if (s.type === "local") {
              const same = await s.handle.isSameEntry(handle);
              if (same) {
                console.log("sources:", sources);
                throw new Error(`"${handle.name}" is already registered as a local source.`);
              }
            }
          }
        }        

        /* if (sources.some((s) => s.type === type && s.handle.isSameEntry(handle))) {
          console.log("sources:", sources);
          throw new Error(`"${handle.name}" is already registered as a local source.`);
        } */
        newName = name ? name : handle.name;
        newSource = {
          name: newName,
          type,
          handle,
        };
        setSources([...sources, newSource]);
        break;

      default:
        throw new Error(`Unsupported source type: "${type}"`);
    }

    console.debug("New source added:", newSource);
    console.debug("Updated sources:", sources);
    console.debug("Sources[] size after addition:", sources.length);
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
