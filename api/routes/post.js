const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post");
const checkAuth = require("../middlewares/checkAuth");

router.get("/allposts", checkAuth, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      return res.status(404).json({ error: error });
    });
});

router.post("/createpost", checkAuth, (req, res) => {
  const { title, body, image_url } = req.body;
  console.log(title, body, image_url);
  if (!title || !body || !image_url) {
    console.table(title, body, image_url);

    return res.status(402).json({ error: "Please add all the fields" });
  }

  req.userData.password = undefined;
  const post = new Post({
    title: title,
    body: body,
    image_url: image_url,
    postedBy: req.userData,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((error) => {
      return res.status(500).json({ error: error });
    });
});

router.get("/myposts", checkAuth, (req, res) => {
  Post.find({ postedBy: req.userData._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json(myposts);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });

  router.delete("/deletepost/:postID", checkAuth, (req, res) => {
    Post.findOne({ _id: req.params.postID })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(422).json({ error: err });
        } else if (
          post.postedBy._id.toString() === req.userData._id.toString()
        ) {
          post
            .remove()
            .then((result) => {
              res.json({ message: "Successfully Deleted" });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  });
});

module.exports = router;
