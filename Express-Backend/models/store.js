const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    id: Number,
    name: String,
    slug: String,
    summary: String,
    storyline: String,
    category: Number,
    game_type: Number,
    status: Number,
    first_release_date: Number,
    created_at: Number,
    updated_at: Number,

    age_ratings: [Number],
    aggregated_rating: Number,
    aggregated_rating_count: Number,
    alternative_names: [Number],
    artworks: [Number],
    bundles: [Number],
    cover: Number,
    cover_url: String,

    dlcs: [Number],
    expansions: [Number],
    external_games: [Number],
    game_engines: [Number],
    game_modes: [Number],
    genres: [Number],
    hypes: Number,
    involved_companies: [Number],
    keywords: [Number],
    multiplayer_modes: [Number],
    platforms: [Number],
    player_perspectives: [Number],
    rating: Number,
    rating_count: Number,
    release_dates: [Number],
    screenshots: [Number],
    similar_games: [Number],
    tags: [Number],
    themes: [Number],
    total_rating: Number,
    total_rating_count: Number,
    url: String,
    videos: [Number],
    websites: [Number],
    language_supports: [Number],
    game_localizations: [Number],
    collections: [Number],

    // Business specific
    gameKeys: [String],
    price: Number,
    copies: Number,

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

module.exports = mongoose.model('StoreGames', StoreSchema);
