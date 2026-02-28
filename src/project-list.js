import { dateHandler } from "../src/date-handling.js";

class FormExpander {
  constructor(textarea) {
    this.textarea = textarea;
    this.init();
  }

  init() {
    this.textarea.addEventListener("input", () => this.expand());
  }

  expand() {
    this.textarea.style.height = "auto";
    this.textarea.style.height = this.textarea.scrollHeight + "px";
  }
}

class Task {
  constructor({ title, description = "", priority = "low", dueDate = "", completed = false }) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = completed;
  }
}

class TaskList {
  constructor(listElement, inputElement, addButton, dateInput, projectRef = null) {
    this.list = listElement;
    this.input = inputElement;
    this.addButton = addButton;
    this.dateInput = dateInput;

    this.tasks = [];
    this.selectedTaskIndex = null;
    this.projectRef = projectRef; 

    this.titleField = document.getElementById("task-title");
    this.descField = document.getElementById("task-desc");
    this.priorityField = document.getElementById("priority");
    this.dueDateField = document.getElementById("task-due-date");

    this.addButton.addEventListener("click", () => this.handleAddTask());
    this.input.addEventListener("keydown", e => {
      if (e.key === "Enter") this.handleAddTask();
    });

    [this.titleField, this.descField, this.priorityField, this.dueDateField].forEach(field => {
      field.addEventListener("input", () => this.updateSelectedTask());
    });
  }

  handleAddTask() {
    const text = this.input.value.trim();
    if (!text) return;

    const task = new Task({ title: text });
    this.tasks.push(task);

    this.syncTasksToProject();

    this.refreshList();
    const newIndex = this.tasks.length - 1;
    this.selectTask(newIndex);

    this.input.value = "";
    if (this.dateInput) this.dateInput.value = "";
  }

  handleDeleteTask(index) {
    this.tasks.splice(index, 1);

    if (this.selectedTaskIndex !== null) {
      if (this.selectedTaskIndex === index) {
        this.selectedTaskIndex = null;
        this.clearDetailsPanel();
      } else if (this.selectedTaskIndex > index) {
        this.selectedTaskIndex--;
      }
    }

    this.syncTasksToProject();
    this.refreshList();
  }

  refreshList() {
    this.list.innerHTML = "";
    this.tasks.forEach((task, i) => this.addTaskToDOM(task, i));
  }

  clearDetailsPanel() {
    this.titleField.textContent = "";
    this.descField.value = "";
    this.priorityField.value = "low";
    this.dueDateField.value = "";
  }

  addTaskToDOM(task, index) {
    const listItem = document.createElement("div");
    listItem.classList.add("list-item");
    if (task.completed) listItem.classList.add("completed");

    const leftDiv = document.createElement("div");
    leftDiv.classList.add("list-item-left");

    const li = document.createElement("li");
    li.textContent = task.title;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      listItem.classList.toggle("completed", task.completed);
      this.syncTasksToProject();
    });

    leftDiv.appendChild(li);
    leftDiv.appendChild(checkbox);

    if (task.dueDate) {
      const dateObj = new dateHandler(task.dueDate);
      const dueString = dateObj.dueDateString();
      if (dueString) {
        const dueSpan = document.createElement("span");
        dueSpan.textContent = ` (${dueString})`;
        dueSpan.classList.add("due-date-text");
        li.appendChild(dueSpan);
      }
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
    );
    svg.appendChild(path);
    svg.classList.add("task-deleter");
    svg.addEventListener("click", () => this.handleDeleteTask(index));

    listItem.appendChild(leftDiv);
    listItem.appendChild(svg);

    li.addEventListener("click", () => this.selectTask(index));

    this.list.appendChild(listItem);
  }

  selectTask(index) {
    const task = this.tasks[index];
    if (!task) return;

    this.selectedTaskIndex = index;
    this.titleField.textContent = task.title;
    this.descField.value = task.description;
    this.priorityField.value = task.priority;
    this.dueDateField.value = task.dueDate;
  }

  updateSelectedTask() {
    if (this.selectedTaskIndex === null) return;

    const task = this.tasks[this.selectedTaskIndex];
    task.title = this.titleField.textContent;
    task.description = this.descField.value;
    task.priority = this.priorityField.value;
    task.dueDate = this.dueDateField.value;

    const listItem = this.list.children[this.selectedTaskIndex];
    const liText = listItem.querySelector("li");
    liText.firstChild.nodeValue = task.title;

    const dueSpan = liText.querySelector(".due-date-text");
    if (task.dueDate) {
      const dateObj = new dateHandler(task.dueDate);
      const dueString = dateObj.dueDateString();
      if (dueString) {
        if (dueSpan) dueSpan.textContent = ` (${dueString})`;
        else {
          const newSpan = document.createElement("span");
          newSpan.textContent = ` (${dueString})`;
          newSpan.classList.add("due-date-text");
          liText.appendChild(newSpan);
        }
      }
    } else if (dueSpan) {
      dueSpan.remove();
    }

    this.syncTasksToProject();
  }

  syncTasksToProject() {
    if (this.projectRef) {
      this.projectRef.tasks = this.tasks;
      if (this.projectRef.parent?.saveProjects) {
        this.projectRef.parent.saveProjects();
      }
    }
  }
}

class TodoApp {
  constructor({ taskInputId, addButtonId, listId, dueDateId, descriptionId }) {
    this.taskInput = document.getElementById(taskInputId);
    this.taskAdder = document.getElementById(addButtonId);
    this.list = document.getElementById(listId);
    this.dueDateInput = document.getElementById(dueDateId);
    this.descriptionTextarea = document.getElementById(descriptionId);

    this.formExpander = new FormExpander(this.descriptionTextarea);

    this.taskList = new TaskList(
      this.list,
      this.taskInput,
      this.taskAdder,
      this.dueDateInput
    );

    this.preventFormSubmit();
  }

  preventFormSubmit() {
    const form = document.getElementById("task-form");
    if (!form) return;
    form.addEventListener("submit", e => e.preventDefault());
  }
}

export { TaskList, TodoApp, Task };