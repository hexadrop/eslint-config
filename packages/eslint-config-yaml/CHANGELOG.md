# @hexadrop/eslint-config-yaml

## 1.0.0

### Minor Changes

- Initial release: the YAML slice of the hexadrop ESLint config. Registers `eslint-plugin-yml` under the `yaml` prefix, wires its YAML language for `*.yml`/`*.yaml` files and Markdown fenced blocks, and applies the plugin's `standard` conventions with two-space indentation and single quotes. Key ordering is intentionally not enforced.
