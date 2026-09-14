---
'@hexadrop/eslint-config-astro': patch
'@hexadrop/eslint-config': patch
---

Extract the Astro concern into the new `@hexadrop/eslint-config-astro` package, publishable and usable standalone via its `astro()` factory. The meta-package lazy-loads it via `optionalPlugin` so astro integration activates only when the consumer installs it.