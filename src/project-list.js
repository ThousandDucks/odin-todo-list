
// Handles automatic textarea expansion
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

// Handles adding tasks to a list
class TaskList {
  constructor(listElement, inputElement) {
    this.list = listElement;
    this.input = inputElement;
  }

  addTask(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText || "New Task";
    this.list.appendChild(li);
  }
}

// Main app orchestrator
class TodoApp {
  constructor({ textareaId, addButtonId, listId, taskInputID }) {
    this.textarea = document.getElementById(textareaId);
    this.taskAdder = document.getElementById(addButtonId);
    this.list = document.getElementById(listId);
    this.taskInput = document.getElementById(taskInputID);

    this.formExpander = new FormExpander(this.textarea);
    this.taskList = new TaskList(this.list, this.textarea);

    this.init();
  }

  init() {
    this.taskAdder.addEventListener("click", () => {
      this.taskList.addTask(this.taskInput.value);
      this.textInput.value = "";
    });
  }
}

// Run app
document.addEventListener("DOMContentLoaded", () => {
  new TodoApp({
    textareaId: "task-desc",
    addButtonId: "task-adder",
    listId: "todo-items",
    taskInputID: "task-input"
  });
});