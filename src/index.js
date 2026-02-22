import { TodoApp } from "../src/project-list.js";
import { Project } from "../src/project-handler.js";
import "./main-style.css";

function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      window[type] && window[type].length !== 0
    );
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const todoApp = new TodoApp({
    taskInputId: "task-input",
    addButtonId: "task-adder",
    listId: "todo-items",
    dueDateId: "task-due-date",
    descriptionId: "task-desc"
  });

  // Pass the actual TaskList instance to Project
  new Project("project-list", todoApp.taskList, "notepad-header");
});