import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Can't find posts" });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Can't find posts" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { views: 1 } },
      { returnDocument: "after" },
      (err, doc) => {
        if (err) {
          console.log(error);
          return res.status(500).json({ message: "Can't return posts" });
        }
        if (!doc) {
          res.status(404).json({ message: "Can't find doc(post)" });
        }
        res.json(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Can't find post" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndRemove({ _id: postId }, (err, doc) => {
      if (err) {
        console.log(error);
        return res.status(500).json({ message: "Can't delete post" });
      }
      if (!doc) {
        res.status(404).json({ message: "Can't find doc(post)" });
      }
      res.json({ message: "Success delete post" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Can't remove post" });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No add post" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(","),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({ message: "Success update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Can't update post" });
  }
};
