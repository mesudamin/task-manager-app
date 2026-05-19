const services = require("../services/taskService");
const utils = require("../utils/helpers");

// get routes

function getTasksOnSearch(req, res) {
  const { title, limit } = req.query;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title query is required",
    });
  }

  const query = title.toLowerCase().trim();

  let search = services.searchTask(query, limit);
  if (search.success === null) {
    return res.status(400).json({
      success: false,
      message: search.message,
    });
  }

  if (!search.success) {
    return res.status(500).json({
      success: false,
      message: search.message,
    });
  }

  res.json({
    success: true,
    data: search.data,
  });
}
function getTasksOnsort(req, res) {
  const { by } = req.query;
  if (!by || by.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "by query is required",
    });
  }

  let sortedtasks = services.sortTasks();
  if (!sortedtasks.success) {
    return res.status(500).json({
      success: false,
      message: sortedtasks.message,
    });
  }

  res.json({
    success: true,
    data: sortedtasks.data,
  });
}

function getTasksCount(req, res) {
  let constAll = services.countTasks();
  if (!constAll.success) {
    return res.status(500).json({
      success: false,
      message: constAll.message,
    });
  }

  res.json({
    success: true,
    data: constAll.data,
  });
}

function getTasksOnId(req, res) {
  let checkedId = utils.parseId(req.params.id);

  if (checkedId === null) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
  let getOnId = services.readOnId(checkedId);
  if (getOnId.success === null) {
    return res.status(404).json({ success: false, message: getOnId.message });
  } else if (!getOnId.success) {
    return res.status(500).json({
      success: false,
      message: getOnId.message,
    });
  }

  res.json({ success: true, data: getOnId.data });
}

function getTasks(req, res) {
  let allTasks = services.readAll();
  if (!allTasks.success) {
    return res.status(500).json({
      success: false,
      message: allTasks.message,
    });
  }

  res.json({ success: true, data: allTasks.data });
}

// // post route
function postTasks(req, res) {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  const cleanedTitle = title.trim();
  let createTask = services.postTask(cleanedTitle);

  if (createTask.success === null) {
    return res
      .status(409)
      .json({ success: false, message: createTask.message });
  }

  if (!createTask.success) {
    return res.status(500).json({
      success: false,
      message: createTask.message,
    });
  }

  res.status(201).json({ success: true, data: createTask.data });
}

// // delete routes
function deleteTasksOnId(req, res) {
  let checkedId = utils.parseId(req.params.id);

  if (checkedId === null) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
  let deleteTask = services.deleteOnId(checkedId);
  if (deleteTask.success === null) {
    return res
      .status(404)
      .json({ success: false, message: deleteTask.message });
  } else if (!deleteTask.success) {
    return res.status(500).json({
      success: false,
      message: deleteTask.message,
    });
  }
  res.status(200).json({ success: true, data: deleteTask.message });
}
function deleteTasks(req, res) {
  const confirm = req.query.confirm;

  if (confirm !== "true") {
    return res.status(400).json({
      success: false,
      message: "Add ?confirm=true to delete all tasks",
    });
  }
  let deleteAll = services.deleteAll();
  if (!deleteAll.success) {
    return res.status(500).json({
      success: false,
      message: deleteAll.message,
    });
  }
  res.json({
    success: true,
    data: deleteAll.message,
  });
}

// patch route
function toggleDone(req, res) {
  let checkedId = utils.parseId(req.params.id);
  if (checkedId === null) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
  const { done } = req.body;
  if (done === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "done is required" });
  }
  let result = services.toggleDone(checkedId, done);
  if (result.success === null) {
    return res.status(404).json({ success: false, message: result.message });
  }
  if (!result.success) {
    return res.status(500).json({ success: false, message: result.message });
  }
  res.json({ success: true, data: result.data });
}
function patchTasks(req, res) {
  let checkedId = utils.parseId(req.params.id);

  if (checkedId === null) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  const cleanedTitle = title.trim();
  let updateTask = services.updateTask(checkedId, cleanedTitle);
  if (updateTask.success === null) {
    return res
      .status(404)
      .json({ success: false, message: updateTask.message });
  }
  if (!updateTask.success) {
    return res.status(500).json({
      success: false,
      message: updateTask.message,
    });
  }
  res.json({ success: true, data: updateTask.data });
}

// exported function
module.exports = {
  getTasks,
  postTasks,
  getTasksOnId,
  getTasksCount,
  getTasksOnSearch,
  deleteTasksOnId,
  deleteTasks,
  patchTasks,
  getTasksOnsort,
  toggleDone,
};
