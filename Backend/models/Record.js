const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    title      : String,
    url        : String,
    insight    : String,
    region     : { type : String, index : true },
    country    : { type : String, index : true },
    impact     : { type : String, index : true },
    topic      : { type : String, index : true },
    sector     : { type : String, index : true },
    pestle     : { type : String, index : true },
    source     : { type : String, index : true },
    published  : { type : String, index : true },

    intensity  : { type : Number, default : null, index : true },
    likelihood : { type : Number, default : null, index : true },
    relevance  : { type : Number, default : null, index : true },
    start_year : { type : Number, default : null, index : true },
    end_year   : { type : Number, default : null, index : true }
}, {strict : false, timestamps : true});

module.exports = mongoose.model('Record',RecordSchema);