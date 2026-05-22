let task = [];
let inediting = null;
let filterstute = "all";

let save = document.getElementById("save");
let remove = document.getElementById("remove");
let input = document.getElementById("input");
let ul = document.getElementById("ul");
let list = document.getElementById("list");

let span = document.getElementById("error-msg");

async function errorHandler(response) {
  span.innerText = "";
  let resError = await response.json();
  let error = resError.message;
  span.innerText = `${error}`;
}

const API = "http://localhost:3000/tasks";

// LOAD TASKS FROM BACKEND
async function loadTasks() {
  try {
    let response = await fetch(API);

    if (!response.ok) {
      errorHandler(response);
      return;
    }
    span.innerText = "";

    let result = await response.json();
    task = result.data;
    render();
  } catch (error) {
    span.innerText = "Network error. Please try again.";
  }
}
// SAVE FUNCTION
async function savebtn() {
  save.disabled = true;
  save.textContent = "saving...";
  try {
    let value = input.value.trim();
    if (inediting !== null) {
      let response = await fetch(`${API}/${inediting}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value }),
      });
      if (!response.ok) {
        inediting = null;
        input.value = "";

        save.innerText = "save";

        errorHandler(response);
        return;
      }
      save.innerText = "save";
      inediting = null;
    } else {
      let response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, done: false }),
      });
      if (!response.ok) {
        errorHandler(response);
        return;
      }
    }
    span.innerText = "";

    input.value = "";
    loadTasks();
  } catch (error) {
    span.innerText = "Network error. Please try again.";
  } finally {
    save.disabled = false;
    save.textContent = "save";
  }
}
save.addEventListener("click", savebtn);

// RENDER FUNCTION
function render() {
  ul.innerHTML = "";
  let data = task;

  if (filterstute === "Active") {
    data = data.filter((t) => t.done === false);
  }
  if (filterstute === "Completed") {
    data = data.filter((t) => t.done === true);
  }

  list.innerText = "my tasks";
  if (data.length === 0) {
    list.innerText = "no task yet";
  }

  for (let i = 0; i < data.length; i++) {
    let li = document.createElement("li");
    let delebtn = document.createElement("button");
    let checkbox = document.createElement("input");
    let edit = document.createElement("button");

    li.innerText = data[i].title;
    li.dataset.id = data[i].id;

    delebtn.classList.add("delebtn");
    delebtn.innerText = "⌫";

    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = data[i].done;
    if (data[i].done == true) {
      li.style.textDecoration = "line-through";
    }

    edit.innerText = "edit";
    edit.classList.add("edits");

    ul.appendChild(li);
    li.appendChild(checkbox);
    li.appendChild(edit);
    li.appendChild(delebtn);
  }
}

// REMOVE ALL
async function removefun() {
  try {
    let response = await fetch(`${API}?confirm=true`, { method: "DELETE" });
    if (!response.ok) {
      errorHandler(response);
      return;
    }
    span.innerText = "";

    loadTasks();
  } catch (error) {
    span.innerText = "Network error. Please try again.";
  }
}
remove.addEventListener("click", removefun);

// INLINE DELETE
ul.addEventListener("click", async (e) => {
  try {
    if (e.target.classList.contains("delebtn")) {
      let parent = e.target.closest("li");
      let id = parent.dataset.id;
      let response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        errorHandler(response);
        return;
      }
      span.innerText = "";
      loadTasks();
    }
  } catch (error) {
    span.innerText = "Network error. Please try again.";
  }
});

// CHECKBOX
ul.addEventListener("change", async (e) => {
  try {
    if (e.target.classList.contains("checkbox")) {
      let parent = e.target.closest("li");
      let id = parent.dataset.id;
      let item = task.find((t) => t.id == id);
      let response = await fetch(`${API}/${id}/done`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: e.target.checked }),
      });
      if (!response.ok) {
        e.target.checked = item.done;
        errorHandler(response);
        return;
      }
      span.innerText = "";
      loadTasks();
    }
  } catch (error) {
    span.innerText = "Network error. Please try again.";
  }
});

// EDIT BTN
ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("edits")) {
    let parent = e.target.closest("li");
    let id = parent.dataset.id;
    let item = task.find((t) => t.id == id);
    input.value = item.title;
    inediting = id;

    save.innerText = "update";
  }
});

// FILTER
let filter = document.getElementById("filter");
filter.addEventListener("click", (e) => {
  if (e.target.classList.contains("all")) filterstute = "all";
  if (e.target.classList.contains("Active")) filterstute = "Active";
  if (e.target.classList.contains("Completed")) filterstute = "Completed";
  filter.open = false;
  render();
});

// START
loadTasks();
