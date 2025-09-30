import mongoose from 'mongoose'

const HistoricSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    userId: {type: String, index:true, required:true},
    license_plate: {type: String, required:true},
    description: {type: String, required: true},
    status: {type:String, enum:['departure', 'arrival'], default: 'departure'},
    deleted: {type: Boolean, default: false},
}, {timestamps: true}) 

HistoricSchema.index({userId: 1, updatedAt: 1})

export const Historic = mongoose.model('Historic', HistoricSchema)