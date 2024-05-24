import error from "../utils/error.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller) return next(error(403, "Satıcılar yorum gönderemez"));

  const newReview = new Review({
    user: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const oldRev = await Review.findOne({
      user: req.userId,
      gigId: req.body.gigId,
    });

    if (oldRev) return next(error(403, "Zaten bu hizmete yorumunuz var"));

    await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { starCount: req.body.star, reviewCount: 1 },
    });

    res.status(201).json({
      message: "Yorum gönderildi",
      data: newReview,
    });
  } catch (err) {
    console.log(err);
    next(error(500, "Yorum gönderilirken bir sorun oluştu"));
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).populate(
      "user"
    );
    res.status(200).json({ reviews });
  } catch (err) {
    next(error(500, "Yorumlar alnırken bir sorun oluştu"));
  }
};

export const deleteReview = () => {};
