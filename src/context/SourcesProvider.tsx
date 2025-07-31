import { createContext, FC, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getRepoMetadata, verifyRepoExists } from "../lib/github";
import { useLocalStorage } from "../lib/hooks";
import { useGitHubApi } from "./GitHubApiProvider";

export interface BaseSource {
  id: string;
  name: string;
}

export interface GitHubSource extends BaseSource {
  type: "github";
  path: string;
  default_branch: string;
}

export interface LocalSource extends BaseSource {
  type: "local";
  handle: FileSystemDirectoryHandle;
}

export type Source = GitHubSource | LocalSource;

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

interface SourcesProviderProps {
  children: React.ReactNode;
}

export const SourcesProvider: FC<SourcesProviderProps> = ({ children }) => {
  const [sources, setSources] = useLocalStorage<Source[]>("sources", []);
  const { gitHubToken } = useGitHubApi();

  const addSource = async (args: AddSourceArgs) => {
    const { type, path, name } = args;

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
          id: uuidv4(),
          type: "github",
          path: path,
          name: newName,
          default_branch: default_branch,
        };
        setSources([...sources, newSource]);
        break;
      
      case "local":
        // Check browser support for showDirectoryPicker
        let handle: FileSystemDirectoryHandle;
        if (typeof window.showDirectoryPicker !== "function") {
          throw new Error("Your browser does not support local file access."
            + " Please use a chromium-based browser (chrome, edge, opera, etc.)"
            + " to use this feature.");
        }
        try {
          handle = await window.showDirectoryPicker();
        } catch (error: any) {
          if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Folder selection was cancelled.");
          }
          throw new Error(`Failed to select folder. ${error.message}`);
        }

        // Check if the source is already registered
        for (const s of sources) {
          if (s.type === "local") {
            if (await s.handle.isSameEntry(handle)) {
              throw new Error(`"${handle.name}" is already registered as a local source.`);
            }
          }
        }

        newName = name ? name : handle.name;
        newSource = {
          id: uuidv4(),
          name: newName,
          type: "local",
          handle: handle,
        };
        setSources([...sources, newSource]);
        break;

      default:
        throw new Error(`Unsupported source type: "${type}"`);
    }
  };

  const deleteSource = (source: Source) => {
    setSources(sources.filter((r) => r.id !== source.id));
  };

  return (
    <SourcesContext.Provider value={{ sources, setSources, addSource, deleteSource }}>
      {children}
    </SourcesContext.Provider>
  );
};
