import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";

const model = Model();
const view  = View(document);
Controller(model, view);