# Backlog

Deferred tasks and improvements parked during code review so the current iteration stays unpolluted. Each entry names the package it belongs to, links the review that surfaced it, and says when it should be picked up.

An entry is ready to leave the backlog when its **pick up when** condition fires; at that point open an issue, convert the entry into the issue body, and delete the file.

## Entries

| Entry                                                                           | Package                         | Kind     | Pick up when                                                        |
|---------------------------------------------------------------------------------|---------------------------------|----------|---------------------------------------------------------------------|
| [Peer-present presence detection test](peer-present-presence-detection-test.md) | `@hexadrop/eslint-config-react` | Test gap | Extracting `@hexadrop/eslint-config-typescript`                     |
| [Typescript option coercion at meta call-sites](typescript-option-coercion.md)  | `@hexadrop/eslint-config`       | Smell    | A third `react(...)` call-site appears, or the react options evolve |
| [Package-manager-agnostic install error](install-error-wording.md)              | `@hexadrop/eslint-config-react` | Wording  | Next time the error message is touched                              |
