const express = require("express");
const app = express();
const router = express.Router();
const controller = require("../controllers/taskscontroller");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// get routes
router.get("/tasks/sort", controller.getTasksOnsort);

router.get("/tasks/search", controller.getTasksOnSearch);
router.get("/tasks/count", controller.getTasksCount);
router.get("/tasks/:id", controller.getTasksOnId);
router.get("/tasks", controller.getTasks);
// post route
router.post("/tasks", controller.postTasks);
// // delete routes
router.delete("/tasks/:id", controller.deleteTasksOnId);
router.delete("/tasks", controller.deleteTasks);
// // patch route
router.patch("/tasks/:id/done", controller.toggleDone);
router.patch("/tasks/:id", controller.patchTasks);

module.exports = router;
