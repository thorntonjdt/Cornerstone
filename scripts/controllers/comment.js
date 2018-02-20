var Comment = require('../models/comment');
var Ticket = require('../models/ticket');

module.exports = {
  create: async (req, res) => {
    let newComment = new Comment({
      author: req.body.author,
      content: req.body.content
    })

    await newComment.save();

    await Ticket.update({_id: req.params.id}, {$push: {comments: newComment._id}});

    res.send({"id": newComment});
  }
}
