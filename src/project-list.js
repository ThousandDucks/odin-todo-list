const textarea = document.getElementById("task-desc");

textarea.addEventListener("input", function() {
  this.style.height = "auto";                // reset height
  this.style.height = this.scrollHeight + "px";  // expand to fit content
});
