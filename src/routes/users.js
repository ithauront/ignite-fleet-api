import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/me', auth, async (req, res) => {
  const me = await User.findById(req.userId).lean();
  if (!me) return res.status(404).json({ error: 'Not found' });
  return res.json({ user: me });
});

router.put('/me', auth, async (req, res) => {
  const { name, pictureUrl } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.userId,
    { ...(name && { name }), ...(pictureUrl && { pictureUrl }) },
    { new: true }
  ).lean();
  return res.json({ user: updated });
});

export default router;
