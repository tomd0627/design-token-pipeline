import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

register(StyleDictionary);

export default {
  source: ["tokens/**/*.json"],
  log: { verbosity: "verbose" },
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      transforms: ["name/kebab"],
      prefix: "token",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            outputReferences: false,
          },
        },
      ],
    },
    js: {
      transformGroup: "tokens-studio",
      transforms: ["name/camel"],
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/esm",
        },
        {
          destination: "tokens.d.ts",
          format: "typescript/es6-declarations",
        },
      ],
    },
  },
};
