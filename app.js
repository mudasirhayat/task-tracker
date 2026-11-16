(function () {
  "use strict";

  const STORAGE_KEY = "task-tracker.tasks";

  const form = document.getElementById("add-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("count");
  const errorEl = document.getElementById("error");
  const clearDoneBtn = document.getElementById("clear-done");
  const filterButtons = Array.from(document.querySelectorAll(".filter"));

  let tasks = load();
  let filter = "all";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage unavailable; keep in-memory state */
    }
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }

  function addTask(title) {
    const trimmed = title.trim();
    if (!trimmed) {
      showError("Task title cannot be empty.");
      return;
    }
    if (tasks.some((t) => t.title.toLowerCase() === trimmed.toLowerCase())) {
      showError("That task already exists.");
      return;
    }
    clearError();
    tasks.push({ id: Date.now().toString(36), title: trimmed, done: false });
    save();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done;
    save();
    render();
  }

  function deleteTask(id) {
    // Remove just the one row instead of re-rendering the whole list.
    const row = list.querySelector('[data-id="' + id + '"]');
    if (row) row.remove();
  }

  function clearCompleted() {
    tasks = tasks.filter((t) => !t.done);
    save();
    render();
  }

  function visibleTasks() {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }

  function render() {
    list.innerHTML = "";
    const visible = visibleTasks();

    for (const task of visible) {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");
      li.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Mark \"" + task.title + "\" as " + (task.done ? "not done" : "done"));
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = task.title;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete";
      del.textContent = "✕";
      del.setAttribute("aria-label", "Delete \"" + task.title + "\"");
      del.addEventListener("click", () => deleteTask(task.id));

      li.append(checkbox, title, del);
      list.appendChild(li);
    }

    emptyState.hidden = tasks.length > 0;
    const remaining = tasks.filter((t) => !t.done).length;
    countEl.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
    clearDoneBtn.hidden = !tasks.some((t) => t.done);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(input.value);
    input.value = "";
    input.focus();
  });

  clearDoneBtn.addEventListener("click", clearCompleted);

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle("is-active", b === button));
      render();
    });
  }

  render();
})();
