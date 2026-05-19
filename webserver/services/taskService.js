// storage functions
const storage = require("../storage/taskstore");
// utils
const utils = require("../utils/helpers");
function searchTask(query, limit) {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;
  let filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query),
  );
  if (limit !== undefined) {
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedLimit) || parsedLimit < 0) {
      return {
        success: null,
        data: null,
        message: "Invalid limit",
      };
    }

    filteredTasks = filteredTasks.slice(0, parsedLimit);
  }

  return { success: true, data: filteredTasks, message: null };
}

function sortTasks(params) {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;
  let sortedtask = [...tasks].sort((a, b) => b.createdat - a.createdat);
  return { success: true, data: sortedtask, message: null };
}
function countTasks() {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;
  let count = tasks.length;
  return { success: true, data: count, message: null };
}
function readOnId(id) {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;
  let find = utils.findTaskById(id, tasks);

  if (!find.success) {
    return { success: null, data: null, message: "task not found" };
  }
  let task = find.data;

  return { success: true, data: task, message: null };
}
function readAll() {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }

  return { success: true, data: read.data, message: null };
}
function postTask(cleanedTitle) {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;

  let duplicate = tasks.some((dup) => dup.title === cleanedTitle);
  if (duplicate) {
    return {
      success: null,
      data: null,
      message: "task is  duplicated",
    };
  }

  const newTask = {
    id: utils.generateId(tasks),
    title: cleanedTitle,
    done: false,
    createdat: Date.now(),
  };

  let create = storage.createTask(newTask);
  if (!create.success) {
    return {
      success: false,
      data: null,
      message: create.message,
    };
  }
  return { success: true, data: create.data, message: null };
}

function deleteOnId(id) {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;
  const find = utils.findTaskIndex(id, tasks);
  if (!find.success) {
    return { success: null, data: null, message: "task not found" };
  }
  let index = find.data;
  tasks.splice(index, 1);

  let deleteOnId = storage.deleteTask(tasks);
  if (!deleteOnId.success) {
    return {
      success: false,
      data: null,
      message: deleteOnId.message,
    };
  }
  return { success: true, data: null, message: "task is  deleted" };
}
function deleteAll() {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;

  const count = tasks.length;
  tasks.length = 0;
  let deleteAll = storage.deleteTask(tasks);
  if (!deleteAll.success) {
    return {
      success: false,
      data: null,
      message: deleteAll.message,
    };
  }
  return { success: true, data: null, message: `${count} tasks deleted` };
}
function toggleDone(id, done) {
  let read = storage.read();
  if (!read.success) {
    return { success: false, data: null, message: read.message };
  }
  const tasks = read.data;
  let find = utils.findTaskById(id, tasks);
  if (!find.success) {
    return { success: null, data: null, message: "task not found" };
  }
  let task = find.data;
  task.done = done;
  let update = storage.updateTask(tasks);
  if (!update.success) {
    return { success: false, data: null, message: update.message };
  }
  return { success: true, data: task, message: null };
}
function updateTask(id, cleanedTitle) {
  let read = storage.read();

  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  const tasks = read.data;
  let find = utils.findTaskById(id, tasks);

  if (!find.success) {
    return { success: null, data: null, message: "task not found" };
  }
  let task = find.data;
  task.title = cleanedTitle;
  let updateTask = storage.updateTask(tasks);
  if (!updateTask.success) {
    return {
      success: false,
      data: null,
      message: updateTask.message,
    };
  }
  return { success: true, data: task, message: null };
}
module.exports = {
  readAll,
  readOnId,
  postTask,
  deleteOnId,
  deleteAll,
  updateTask,
  countTasks,
  sortTasks,
  searchTask,
  toggleDone,
};
