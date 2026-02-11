const News = require('../models/News');

class NewsController {
  // [GET] /news
  index(req, res, next) {
    News.find({})
      .lean()
      .then(news => {
        res.render('news', { news });
      })
      .catch(next);
  }

  // [GET] /news/:slug
  async show(req, res, next) {
    try {
      const Comment = require('../models/Comment');
      const news = await News.findOne({ slug: req.params.slug })
        .populate('user_id') // Author
        .lean();

      if (!news) return res.status(404).send('News not found');

      const comments = await Comment.find({ news_id: news._id })
        .populate('user_id') // Commenter
        .sort({ createdAt: -1 })
        .lean();

      const isLiked = req.user && news.likes && news.likes.some(id => id.toString() === req.user._id.toString());
      const likeCount = news.likes ? news.likes.length : 0;

      res.render('news/show', { news, comments, isLiked, likeCount });
    } catch (err) {
      next(err);
    }
  }

  // [POST] /news/:id/like
  async toggleLike(req, res, next) {
    try {
      const news = await News.findById(req.params.id);
      if (!news) return res.status(404).send('News not found');

      const userId = req.user._id;
      if (!news.likes) news.likes = [];
      const isLiked = news.likes.includes(userId);

      if (isLiked) {
        await News.updateOne({ _id: req.params.id }, { $pull: { likes: userId } });
      } else {
        await News.updateOne({ _id: req.params.id }, { $addToSet: { likes: userId } });
      }

      // Return updated status for AJAX
      const updatedNews = await News.findById(req.params.id);
      res.json({
        success: true,
        isLiked: !isLiked,
        likeCount: updatedNews.likes.length
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  // [POST] /news/:id/comments
  async storeComment(req, res, next) {
    try {
      const Comment = require('../models/Comment');
      const news = await News.findById(req.params.id); // Get news to redirect back correctly

      const comment = new Comment({
        content: req.body.content,
        user_id: req.user._id,
        news_id: req.params.id,
      });
      await comment.save();

      // Populate user info to return to client
      await comment.populate('user_id');

      res.json({ success: true, comment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  // [DELETE] /news/:id
  destroy(req, res, next) {
    News.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [GET] /news/create
  create(req, res, next) {
    res.render('news/create');
  }

  // [POST] /news/store
  store(req, res, next) {
    req.body.user_id = req.user._id;
    const news = new News(req.body);
    news.save()
      .then(() => res.redirect('/me/stored/news'))
      .catch(next);
  }

  // [GET] /news/:id/edit
  edit(req, res, next) {
    News.findById(req.params.id)
      .lean()
      .then(news => res.render('news/edit', { news }))
      .catch(next);
  }

  // [PUT] /news/:id
  update(req, res, next) {
    News.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/me/stored/news'))
      .catch(next);
  }

  // [DELETE] /news/comments/:id
  async destroyComment(req, res, next) {
    try {
      const Comment = require('../models/Comment');
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).send('Comment not found');

      const news = await News.findById(comment.news_id);

      // Check permission: Owner of comment OR Owner of news OR Admin
      const isOwner = comment.user_id.toString() === req.user._id.toString();
      const isNewsOwner = news.user_id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (isOwner || isNewsOwner || isAdmin) {
        await Comment.deleteOne({ _id: req.params.id });
        res.json({ success: true, message: 'Deleted successfully' });
      } else {
        res.status(403).json({ success: false, message: 'Permission denied' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  // [PUT] /news/comments/:id
  async updateComment(req, res, next) {
    try {
      const Comment = require('../models/Comment');
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

      // Check permission: Only Owner of comment
      if (comment.user_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Permission denied' });
      }

      comment.content = req.body.content;
      await comment.save();

      res.json({ success: true, message: 'Updated successfully', comment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  // [POST] /news/comments/:id/like
  async toggleLikeComment(req, res, next) {
    try {
      const Comment = require('../models/Comment');
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).send('Comment not found');

      const userId = req.user._id;
      if (!comment.likes) comment.likes = [];
      const isLiked = comment.likes.includes(userId);

      if (isLiked) {
        await Comment.updateOne({ _id: req.params.id }, { $pull: { likes: userId } });
      } else {
        await Comment.updateOne({ _id: req.params.id }, { $addToSet: { likes: userId } });
      }

      const updatedComment = await Comment.findById(req.params.id);
      res.json({
        success: true,
        isLiked: !isLiked,
        likeCount: updatedComment.likes.length
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  // [DELETE] /news/:id/force
  forceDestroy(req, res, next) {
    News.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [PATCH] /news/:id/restore
  restore(req, res, next) {
    News.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new NewsController();
