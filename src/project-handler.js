
class Project {
  constructor(projectListId, taskList, pageTitleId) {
    this.projectList = document.getElementById(projectListId);
    this.taskList = taskList;
    this.pageTitle = document.getElementById(pageTitleId);
    this.projects = [];
    this.selectedProject = null;

    const deleteIcon = document.getElementById("delete-project-icon");

    if (deleteIcon) {
      deleteIcon.addEventListener("click", () => this.deleteSelectedProject());
    }

    if (this.pageTitle) {
      this.pageTitle.addEventListener("input", () => {
        if (!this.selectedProject) return;

        const newName = this.pageTitle.textContent.trim() || "Untitled";

        this.selectedProject.name = newName;

        const li = this.selectedProject.dom.querySelector("li");
        if (li) li.textContent = newName;
      });
    }

    this.handleAddProject = this.handleAddProject.bind(this);
    this.selectProject = this.selectProject.bind(this);

    const existingItems = Array.from(
    this.projectList.querySelectorAll(".project-item li")
    ).filter(li => li.id !== "create-project");

    existingItems.forEach((li) => {
      const container = li.parentElement;
      const projectData = {
        name: li.textContent,
        dom: container,
        tasks: []
      };
      this.projects.push(projectData);

      container.addEventListener("click", () => this.selectProject(container));
    });

    if (this.projects.length > 0) this.selectProject(this.projects[0].dom);

    const createBttn = document.getElementById("create-project");
    createBttn.addEventListener("click", this.handleAddProject);
  }

  handleAddProject() {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-item");

    const projectListItem = document.createElement("li");
    projectListItem.textContent = "New Project";

    projectContainer.appendChild(projectListItem);
    this.projectList.appendChild(projectContainer);

    const projectData = {
      name: projectListItem.textContent,
      dom: projectContainer,
      tasks: []
    };
    this.projects.push(projectData);

    projectContainer.addEventListener("click", () => this.selectProject(projectContainer));

    projectListItem.addEventListener("input", () => {
      projectData.name = projectListItem.textContent;
      if (this.selectedProject === projectData) this.pageTitle.textContent = projectData.name;
    });

    this.selectProject(projectContainer);
  }

  selectProject(projectDiv) {
    const project = this.projects.find(p => p.dom === projectDiv);
    if (!project) return;

    this.selectedProject = project;

    if (this.pageTitle) this.pageTitle.textContent = project.name;

    this.taskList.tasks = project.tasks;

    this.taskList.selectedTaskIndex = null;
    this.taskList.clearDetailsPanel();

    this.taskList.refreshList();

    this.projects.forEach(p => p.dom.classList.remove("selected"));
    projectDiv.classList.add("selected");
    }

    deleteSelectedProject() {
      if (!this.selectedProject) return;

      if (this.projects.length === 1) {
        alert("You must keep at least one project.");
        return;
      }

      const projectToDelete = this.selectedProject;

      projectToDelete.dom.remove();

      this.projects = this.projects.filter(p => p !== projectToDelete);

      const newSelection =
        this.projects[this.projects.length - 1] || this.projects[0];

      this.selectProject(newSelection.dom);
    }
    
}

export { Project };