import type { Dataset } from "@/interfaces/dataset";
import { createContext } from "react";

interface IContext {
  dataset?: Dataset;
  presets?: string;
}

const AnnotateToolContext = createContext<IContext>({});

export default AnnotateToolContext;