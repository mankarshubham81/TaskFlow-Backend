import TaskModel from '../models/Task.js';

class TaskController {
  // Create Task
  static createTask = async (req, res) => {
    try {
      const { title, description } = req.body;
      const newTask = await TaskModel.create({
        title,
        description,
        createdBy: req.user._id
      });
      res.status(201).json({ status: "success", data: newTask });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }

  // Get All Tasks for User
  static getTasks = async (req, res) => {
    try {
      const tasks = await TaskModel.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 });
      res.status(200).json({ status: "success", data: tasks });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }

  // Update Task (title/description)
  static updateTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { title, description } = req.body;

      const task = await TaskModel.findOneAndUpdate(
        { _id: taskId, createdBy: req.user._id },
        { title, description },
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ 
          status: "failed", 
          message: "Task not found or unauthorized" 
        });
      }

      res.status(200).json({ status: "success", data: task });
    } catch (error) {
      res.status(500).json({ 
        status: "failed", 
        message: error.message 
      });
    }
  }


  // Update Task Status
  static updateTaskStatus = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;
      
      const task = await TaskModel.findOneAndUpdate(
        { _id: taskId, createdBy: req.user._id },
        { status },
        { new: true }
      );

      if (!task) return res.status(404).json({ status: "failed", message: "Task not found" });
      res.status(200).json({ status: "success", data: task });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }

  // Delete Task
  static deleteTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await TaskModel.findOneAndDelete({
        _id: taskId,
        createdBy: req.user._id
      });

      if (!task) return res.status(404).json({ status: "failed", message: "Task not found" });
      res.status(200).json({ status: "success", message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  }
}

export default TaskController;