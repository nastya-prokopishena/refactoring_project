import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest"; 

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
    settings: {
      jest: {
        version: "latest", 
      },
    },
  },
  // Introduce Local Extension(Undefined Variables)
  {
    "env": {
      "node": true
    }
  }  
];
