const lintStagedConfig = {
  "*.{ts,tsx,mjs}": ["eslint --fix --max-warnings=0 --no-warn-ignored", "prettier --write"],
  "*.{ts,tsx}": ["vitest related --run --project unit --passWithNoTests"],
  "*.{json,css,md,yaml,yml}": ["prettier --write"],
};

export default lintStagedConfig;
