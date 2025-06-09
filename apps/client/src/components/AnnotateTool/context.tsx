import { createContext } from "react";
import { Label } from "shared";

import type { Dataset } from "@/interfaces/dataset";

interface IContext {
  dataset?: Dataset;
  presets?: Label[];
}

const AnnotateToolContext = createContext<IContext>({});

export default AnnotateToolContext;
