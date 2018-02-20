var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
  author: { id: String, label: String },
  content: { type: String }
}, {timestamps: true});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);
