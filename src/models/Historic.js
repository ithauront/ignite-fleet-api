import mongoose, {Schema} from 'mongoose'

const CoordsSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, required: true },
}, { _id: false });


const HistoricSchema = new Schema({
    _id: {type: String, required: true},
    userId: {type: String, index:true, required:true},
    license_plate: {type: String, required:true},
    description: {type: String, required: true},
    status: {type:String, enum:['departure', 'arrival'], default: 'departure'},
    coords: { type: [CoordsSchema], default: [] },
    deleted: {type: Boolean, default: false},
}, {timestamps: true}) 

HistoricSchema.index({userId: 1, updatedAt: 1})

export const Historic = mongoose.model('Historic', HistoricSchema)