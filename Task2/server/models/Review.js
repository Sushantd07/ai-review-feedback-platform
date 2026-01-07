const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    aiResponse: { type: String },
    aiSummary: { type: String }, // Short 1-sentence summary
    aiAction: { type: String },  // Recommended action for admin
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
