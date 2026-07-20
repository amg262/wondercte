import nextCoreWebVitals from "eslint-config-next/core-web-vitals.js";
import nextTypescript from "eslint-config-next/typescript.js";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ["drizzle/**", ".next/**", "node_modules/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
