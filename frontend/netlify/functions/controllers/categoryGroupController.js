import { CategoryGroup } from '../models/CategoryGroup.js';

export async function listCategoryGroups(_req, res) {
  const groups = await CategoryGroup.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(groups);
}

export async function getCategoryGroup(req, res) {
  const group = await CategoryGroup.findById(req.params.id).lean();

  if (!group) {
    return res.status(404).json({ message: 'Category group not found.' });
  }

  return res.json(group);
}