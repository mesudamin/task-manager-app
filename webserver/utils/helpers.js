const fs = require("fs");
const path = require("path");
//  storage path
let dataPath = path.join(__dirname, "../data/tasks.json");
function parseId(id) {
  let persed = parseInt(id);
  if (isNaN(persed)) {
    return null;
  }
  return persed;
}

function readTasksFromFile() {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    if (!data || data.trim().length === 0) {
      return { success: true, data: [], message: null };
    }

    let tasks = JSON.parse(data);
    return { success: true, data: tasks, message: null };
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
}

function writeTasksToFile(tasks) {
  try {
    const data = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(dataPath, data);
    return { success: true, data: "success", message: null };
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
}

function findTaskById(checkedId, tasks) {
  let allTasks = tasks;
  let task = allTasks.find((t) => t.id === checkedId);
  if (!task) {
    return { success: false, data: null, message: null };
  }

  return { success: true, data: task, message: null };
}
function findTaskIndex(checkedId, tasks) {
  let allTasks = tasks;
  let index = allTasks.findIndex((t) => t.id === checkedId);
  if (index === -1) {
    return { success: false, data: null, message: null };
  }

  return { success: true, data: index, message: null };
}

function generateId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}
// exported function
module.exports = {
  parseId,
  readTasksFromFile,
  writeTasksToFile,
  findTaskById,
  findTaskIndex,
  generateId,
};
