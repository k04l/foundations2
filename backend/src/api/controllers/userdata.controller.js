import User from '../../models/user.model.js';
import { AppError } from '../../middleware/error.middleware.js';

// Get all projects for the authenticated user
export const getUserProjects = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('getUserProjects: No user in request');
      return res.status(401).json({ error: 'Unauthorized: No user found in request' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('getUserProjects: No user found in DB');
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ projects: user.projects || [] });
  } catch (err) {
    console.error('getUserProjects error:', err);
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
