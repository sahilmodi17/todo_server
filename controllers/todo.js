const { findOne, findOneAndUpdate } = require("../models/task");
const User = require("../models/user");
const Task = require("../models/task");

const addTask = async (req, res) => {
  try {
    let dbId = await Task.findOne({ createdId: req.user.userId });
    const { taskid, task } = req.body;

    if (dbId) {      

      dbId.tasks.push({ taskid: taskid, task: task });
      await dbId.save();
      return res.status(200).json(dbId);
    } else {
      const newId = new Task({
        createdId: req.user.userId,
        tasks: [{ taskid: taskid, task: task }],
      });
      await newId.save();
      return res.status(200).json({ newId });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllTasks = async (req, res) => {
  try {
    const task = await Task.find({ createdId: req.user.userId }).sort(
      "createdAt"
    );


    return res.json({ user: req.user, task });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "something went wrong..." });
  }
};

const deleteTask = async (req, res) => {
  try { 
    const {
      user: { userId },
      params: { id: taskId },
    } = req;
    console.log(taskId)
    const deleted = await Task.findOneAndUpdate(
      { createdId: userId },
      { $pull: { tasks: { taskid: taskId } } },
      { safe: true }
    ).clone();
    console.log(deleted);
    if (!deleted) {
      throw new Error("Error While Deleting");
    }
    res.send({ msg: "Task Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ msg: "somthing went wrong..." });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { id: taskId },
    } = req;
    console.log("update")
    const updated = await Task.updateOne(
      {
        tasks: { $elemMatch: { taskid: taskId } },
      },
      {
        $set: {
          "tasks.$.taskid": taskId,
          "tasks.$.task": req.body.task,
        },
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "something went wrong..." });
  }
};

module.exports = {
  addTask,
  getAllTasks,
  deleteTask,
  updateTask,
};
 