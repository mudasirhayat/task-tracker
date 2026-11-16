# Task Tracker

A small vanilla-JS to-do app with no build step and no dependencies. It exists to exercise an automated pull request reviewer against a real, user-visible UI.

**Live demo:** https://mudasirhayat.github.io/task-tracker/

## Run it

```bash
npm start
# open http://localhost:3000
```

Or open `index.html` directly in a browser.

## Features

- Add a task from the input field (empty or duplicate titles show an inline error)
- Tick a task to mark it done; it gets struck through
- Filter the list: **All**, **Active**, **Done**
- Delete a single task with the ✕ button
- **Clear completed** removes every done task
- The footer shows how many tasks are still open
- Tasks persist in `localStorage` across reloads
