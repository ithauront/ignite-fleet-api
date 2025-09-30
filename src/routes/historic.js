import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { Historic } from '../models/Historic.js';

const router = Router();

router.get('/changes', auth, async (req, res)=>{
    const since = Number(req.query.since || 0)
    const limit = Math.min(Number(req.query.limit || 200), 500)
    const userId = req.user.id

    const docs = await Historic.find({
        userId,
        updatedAt: {$gt: new Date(since)}
    }).sort({updatedAt: 1}).limit(limit).lean()

    res.json({
        changes: docs.map(d=>({
            id: d._id,
            user_id: d.userId,
            license_plate: d.license_plate,description: d.description,
            status: d.status,
            deleted: !!d.deleted,
            created_at: +new Date(d.createdAt),
            updated_at: +new Date(d.updatedAt),
        })),
        newSince: docs.length ? +new Date(docs[docs.length - 1].updatedAt) : since
    })
})

router.post('/', auth, async (req,res)=>{
    const userId= req.user.id
    const {id, license_plate, description, status, deleted} = req.body

    if(!id || !license_plate || !description) {
        return res.status(400).json({error: 'Missing fields'})
    }

    const doc = await Historic.findOneAndUpdate(
        {_id: id, userId},
        {
            _id: id,
            userId,
            license_plate,
            description,
            status: status || 'departure',
            deleted: !!deleted,
        },
        {upsert: true, new: true, setDefaultsOnInsert: true}
    )
    res.json({ok: true, id: doc._id, updatedAt:+new Date(doc.updatedAt)})
})

router.put('/:id', auth, async (req, res)=>{
    const userId= req.user.id
    const {id} = req.params
    const {license_plate, description, status, deleted} = req.body;

    const doc = await Historic.findOneAndUpdate(
        {_id: id, userId},
        {license_plate, description, status, deleted: !!deleted},
        {new: true},
    )
    if(!doc) return res.status(404).json({error: 'Not found'})

    res.json({ok: true, id: doc._id, updatedAt:+new Date(doc.updatedAt)})
})

router.delete('/:id', auth, async(req,res)=>{
    const userId = req.user.id
    const {id} = req.params
    const doc = await Historic.findOneAndUpdate(
        {_id: id, userId },
        {deleted: true},
        {new: true}
    )

    if(!doc) return res.status(404).json({error: 'Not found'})

   res.json({ ok: true, id: doc._id, updatedAt: +new Date(doc.updatedAt) })
})

export default router
