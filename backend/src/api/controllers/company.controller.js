// backend/src/api/controllers/company.controller.js
import Company from '../../models/company.model.js';
import Org from '../../models/org.model.js';

// Get all companies
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ _id: { $in: req.user.orgId ? (await Org.findById(req.user.orgId)).companies : [] } });
    res.status(200).json({ companies });
  } catch (err) {
    next(err);
  }
};

// Create or update a company
export const upsertCompany = async (req, res, next) => {
  try {
    const { id, ...companyData } = req.body;
    if (!req.user.orgId) return res.status(403).json({ error: 'User is not part of an organization' });
    let org = await Org.findById(req.user.orgId);
    let company;
    if (id) {
      company = await Company.findOneAndUpdate(
        { id },
        { $set: { ...companyData, id } },
        { upsert: true, new: true }
      );
      if (!org.companies.includes(company._id)) {
        org.companies.push(company._id);
        await org.save();
      }
    } else {
      company = new Company({ ...companyData });
      await company.save();
      org.companies.push(company._id);
      await org.save();
    }
    res.status(200).json({ company });
  } catch (err) {
    next(err);
  }
};

// Delete a company
export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user.orgId) return res.status(403).json({ error: 'User is not part of an organization' });
    const org = await Org.findById(req.user.orgId);
    await Company.findOneAndDelete({ id });
    org.companies = org.companies.filter(cid => cid.toString() !== id);
    await org.save();
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Add Individual
export const addIndividual = async (req, res, next) => {
  try {
    const { id } = req.params;
    const person = { ...req.body, id: Date.now().toString() };
    const company = await Company.findOneAndUpdate(
      { id },
      { $push: { individuals: person } },
      { new: true }
    );
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

// Edit Individual
export const editIndividual = async (req, res, next) => {
  try {
    const { id, personId } = req.params;
    const update = req.body;
    const company = await Company.findOneAndUpdate(
      { id, 'individuals.id': personId },
      { $set: { 'individuals.$': { ...update, id: personId } } },
      { new: true }
    );
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

// Delete Individual
export const deleteIndividual = async (req, res, next) => {
  try {
    const { id, personId } = req.params;
    const company = await Company.findOneAndUpdate(
      { id },
      { $pull: { individuals: { id: personId } } },
      { new: true }
    );
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

// Add Project
export const addProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = { ...req.body, id: Date.now().toString(), peopleIds: [] };
    const company = await Company.findOneAndUpdate(
      { id },
      { $push: { projects: project } },
      { new: true }
    );
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

// Edit Project
export const editProject = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const update = req.body;
    const company = await Company.findOneAndUpdate(
      { id, 'projects.id': projectId },
      { $set: { 'projects.$': { ...update, id: projectId } } },
      { new: true }
    );
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

// Delete Project
export const deleteProject = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const company = await Company.findOneAndUpdate(
      { id },
      { $pull: { projects: { id: projectId } } },
      { new: true }
    );
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

// Assign/remove person to/from project
export const togglePersonOnProject = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const { personId } = req.body;
    const company = await Company.findOne({ id });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const project = company.projects.find(p => p.id === projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!project.peopleIds) project.peopleIds = [];
    if (project.peopleIds.includes(personId)) {
      project.peopleIds = project.peopleIds.filter(pid => pid !== personId);
    } else {
      project.peopleIds.push(personId);
    }
    await company.save();
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};
