import { TodoApp } from "../src/project-list.js";
import { Project } from "../src/project-handler.js";
import "./main-style.css";

// Check if localStorage is usable
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
  // Initialize TodoApp
  const todoApp = new TodoApp({
    taskInputId: "task-input",
    addButtonId: "task-adder",
    listId: "todo-items",
    dueDateId: "task-due-date",
    descriptionId: "task-desc",
  });

  // Initialize Project manager, passing the taskList from TodoApp
  const projectManager = new Project("project-list", todoApp.taskList, "notepad-header");

  // For the currently selected project, link it to TaskList so tasks sync automatically
  if (projectManager.selectedProject) {
    todoApp.taskList.tasks = projectManager.selectedProject.tasks;
    todoApp.taskList.projectRef = projectManager.selectedProject;
    todoApp.taskList.projectRef.parent = projectManager;
  }

  // Whenever a project is selected, update TaskList to point to that project
  const originalSelectProject = projectManager.selectProject.bind(projectManager);
  projectManager.selectProject = (project) => {
    originalSelectProject(project);
    todoApp.taskList.tasks = project.tasks;
    todoApp.taskList.projectRef = project;
    todoApp.taskList.projectRef.parent = projectManager;
    todoApp.taskList.refreshList();
  };
});