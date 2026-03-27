import StyleDictionary from "style-dictionary";
import config from "../config/style-dictionary.config.mjs";

const sd = new StyleDictionary(config);
await sd.buildAllPlatforms();
