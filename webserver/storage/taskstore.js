// helper functions
const utils = require("../utils/helpers");
// error handeller
let errorFromWrting = { message: null };
let errorFromReading = { message: null };
// done state

// queue
let queue = [];
let iswriting = false;
function processQueue() {
  if (queue.length === 0) {
    iswriting = false;
    return;
  }
  while (queue.length > 0) {
    errorFromWrting.message = null;
    errorFromReading.message = null;

    iswriting = true;
    const job = queue.shift();
    const read = utils.readTasksFromFile();
    if (!read.success) {
      errorFromReading.message = read.Error;
      return;
    }
    let tasks = read.data;

    if (job.type === "CREATE") {
      tasks.push(job.payload);
    }

    if (job.type === "UPDATE") {
      tasks = job.payload;
    }

    if (job.type === "DELETE") {
      tasks = job.payload;
    }

    const writeToFile = utils.writeTasksToFile(tasks);
    if (!writeToFile.success) {
      errorFromWrting.message = writeToFile.Error;
      return;
    }
  }
}

function read() {
  let read = utils.readTasksFromFile();
  if (!read.success) {
    return {
      success: false,
      data: null,
      message: read.message,
    };
  }
  return { success: true, data: read.data, message: null };
}

function createTask(newTask) {
  queue.push({
    type: "CREATE",
    payload: newTask,
  });

  processQueue();

  if (errorFromWrting.message !== null || errorFromReading.message !== null) {
    return {
      success: false,
      data: null,
      message: {
        Error_wrting_file: errorFromWrting.message,
        Error_reading_file: errorFromReading.message,
      },
    };
  }

  return { success: true, data: newTask, message: null };
}

function deleteTask(tasks) {
  queue.push({
    type: "DELETE",
    payload: tasks,
  });

  processQueue();

  if (errorFromWrting.message !== null || errorFromReading.message !== null) {
    return {
      success: false,
      data: null,
      message: {
        Error_wrting_file: errorFromWrting.message,
        Error_reading_file: errorFromReading.message,
      },
    };
  }
  return { success: true, data: null, message: null };
}
function updateTask(tasks) {
  queue.push({
    type: "UPDATE",
    payload: tasks,
  });

  processQueue();

  if (errorFromWrting.message !== null || errorFromReading.message !== null) {
    return {
      success: false,
      data: null,
      message: {
        Error_wrting_file: errorFromWrting.message,
        Error_reading_file: errorFromReading.message,
      },
    };
  }
  return { success: true, data: null, message: null };
}
// exported function
module.exports = { read, createTask, deleteTask, updateTask };
