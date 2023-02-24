const express = require("express");
const router = express.Router();

const {
  addTask,
  getAllTasks,
  deleteTask,
  updateTask,
} = require("../controllers/todo");

router.route("/getalltasks").get(getAllTasks);
router.route("/create").post(addTask);
router.route("/delete/:id").delete(deleteTask);
router.route("/update/:id").patch(updateTask);

module.exports = router;
 