import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true
    },
    description:
    {
        type: String,
        required: true,
        trim: true
    },
    category:
    {
        type: String,
        required: true,
        enum: ['Cultural', 'Natural', 'Historical', 'Adventure', 'Religious', 'Food Destinations','Photography'],
        trim: true,
    },
    city:
    {
        type: String,
        required: true,
        trim: true
    },
    address:
    {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    img:
    {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Place = mongoose.models.Place || mongoose.model('Place', placeSchema);
export default Place;
