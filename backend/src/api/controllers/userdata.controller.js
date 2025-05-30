import User from '../../models/user.model.js';
import { AppError } from '../../middleware/error.middleware.js';

// Get all projects for the authenticated user
export const getUserProjects = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ projects: user.projects || [] });
  } catch (err) {
    next(err);
  }
};

// Add or update a project for the authenticated user
export const upsertUserProject = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { id, ...projectData } = req.body;
    let project = user.projects.find(p => p.id === id);
    if (project) {
      Object.assign(project, projectData, { id });
    } else {
      user.projects.push({ ...projectData, id: id || Date.now().toString() });
    }
    await user.save();
    res.status(200).json({ projects: user.projects });
  } catch (err) {
    next(err);
  }
};

// Delete a project for the authenticated user
export const deleteUserProject = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.projects = user.projects.filter(p => p.id !== req.params.projectId);
    await user.save();
    res.status(200).json({ projects: user.projects });
  } catch (err) {
    next(err);
  }
};

// Similar endpoints can be created for people
