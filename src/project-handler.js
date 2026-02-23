class Project {
  constructor(projectListId, taskList, pageTitleId) {
    this.projectList = document.getElementById(projectListId);
    this.taskList = taskList;
    this.pageTitle = document.getElementById(pageTitleId);
    this.projects = [];
    this.selectedProject = null;

    this.loadProjects(); // load saved projects or initialize Today

    // Delete icon (cannot delete Today)
    const deleteIcon = document.getElementById("delete-project-icon");
    if (deleteIcon) {
      deleteIcon.addEventListener("click", () => this.deleteSelectedProject());
    }

    // Sync header edits back to project name
    if (this.pageTitle) {
      this.pageTitle.addEventListener("input", () => {
        if (!this.selectedProject) return;
        const newName = this.pageTitle.textContent.trim() || "Untitled";
        this.selectedProject.name = newName;

        const li = this.selectedProject.dom.querySelector("li");
        if (li) li.textContent = newName;

        this.saveProjects();
      });
    }

    // Bind methods
    this.handleAddProject = this.handleAddProject.bind(this);
    this.selectProject = this.selectProject.bind(this);

    // Setup "Create New Project" button
    const createBttn = document.getElementById("create-project");
    if (createBttn) createBttn.addEventListener("click", this.handleAddProject);
  }

  // --- Load projects from localStorage ---
  loadProjects() {
    const saved = localStorage.getItem("projects");
    const savedProjects = saved ? JSON.parse(saved) : [];

    // Find existing "Today" in HTML
    const todayContainer = Array.from(this.projectList.querySelectorAll(".project-item li"))
      .find(li => li.textContent.trim() === "Today")?.parentElement;

    // Initialize Today
    let todayProject;
    if (todayContainer) {
      todayProject = { name: "Today", dom: todayContainer, tasks: [] };
      todayContainer.addEventListener("click", () => this.selectProject(todayProject));
      this.projects.push(todayProject);
    } else {
      // Create Today if not in HTML
      const projectContainer = document.createElement("div");
      projectContainer.classList.add("project-item");
      const projectListItem = document.createElement("li");
      projectListItem.textContent = "Today";
      projectContainer.appendChild(projectListItem);
      this.projectList.appendChild(projectContainer);

      todayProject = { name: "Today", dom: projectContainer, tasks: [] };
      projectContainer.addEventListener("click", () => this.selectProject(todayProject));
      this.projects.push(todayProject);
    }

    // Load saved projects (skip Today)
    savedProjects.forEach(pData => {
      if (pData.name === "Today") return; // avoid duplicate

      const projectContainer = document.createElement("div");
      projectContainer.classList.add("project-item");

      const projectListItem = document.createElement("li");
      projectListItem.textContent = pData.name;
      projectContainer.appendChild(projectListItem);
      this.projectList.appendChild(projectContainer);

      const projectData = {
        name: pData.name,
        dom: projectContainer,
        tasks: pData.tasks || []
      };
      this.projects.push(projectData);

      // Click handler
      projectContainer.addEventListener("click", () => this.selectProject(projectData));

      // Inline rename
      projectListItem.addEventListener("input", () => {
        projectData.name = projectListItem.textContent;
        if (this.selectedProject === projectData)
          this.pageTitle.textContent = projectData.name;
        this.saveProjects();
      });
    });

    // Select first project by default
    if (this.projects.length > 0) this.selectProject(this.projects[0]);
  }

  // --- Add a new project ---
  handleAddProject() {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-item");

    const projectListItem = document.createElement("li");
    projectListItem.textContent = "New Project";

    projectContainer.appendChild(projectListItem);
    this.projectList.appendChild(projectContainer);

    const projectData = { name: projectListItem.textContent, dom: projectContainer, tasks: [] };
    this.projects.push(projectData);

    projectContainer.addEventListener("click", () => this.selectProject(projectData));

    projectListItem.addEventListener("input", () => {
      projectData.name = projectListItem.textContent;
      if (this.selectedProject === projectData)
        this.pageTitle.textContent = projectData.name;
      this.saveProjects();
    });

    this.selectProject(projectData);
    this.saveProjects();
  }

  // --- Select a project ---
  selectProject(project) {
    this.selectedProject = project;

    if (this.pageTitle) this.pageTitle.textContent = project.name;

    // Link tasks to this project
    this.taskList.tasks = project.tasks;
    this.taskList.projectRef = project;
    this.taskList.selectedTaskIndex = null;
    this.taskList.clearDetailsPanel();
    this.taskList.refreshList();

    this.projects.forEach(p => p.dom.classList.remove("selected"));
    project.dom.classList.add("selected");
  }

  // --- Delete selected project ---
  deleteSelectedProject() {
    if (!this.selectedProject) return;

    // Never delete Today
    if (this.selectedProject.name === "Today") {
      alert("Cannot delete the 'Today' project.");
      return;
    }

    const projectToDelete = this.selectedProject;

    projectToDelete.dom.remove();
    this.projects = this.projects.filter(p => p !== projectToDelete);

    this.saveProjects();

    // Select another project
    const newSelection = this.projects.find(p => p.name !== "Today") || this.projects[0];
    this.selectProject(newSelection);
  }

  // --- Save projects (excluding Today) ---
  saveProjects() {
    const data = this.projects
      .filter(p => p.name !== "Today") // Today is always in HTML
      .map(p => ({ name: p.name, tasks: p.tasks }));
    localStorage.setItem("projects", JSON.stringify(data));
  }
}

export { Project };