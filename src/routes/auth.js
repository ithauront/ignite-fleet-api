import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const { sub: googleId, email, name, picture } = payload;
    if (!googleId || !email) return res.status(401).json({ error: 'Invalid token' });

    const doc = await User.findOneAndUpdate(
      { googleId },
      {
        googleId,
        email,
        name: name ?? 'User',
        pictureUrl: picture ?? ''
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const token = jwt.sign({ uid: doc._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({
      token,
      user: { id: doc._id, name: doc.name, email: doc.email, pictureUrl: doc.pictureUrl }
    });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'Invalid Google token' });
  }
});

export default router;
