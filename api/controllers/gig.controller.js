import error from "./../utils/error.js";
import Gig from "../models/gig.model.js";

const buildFilters = (query) => {
  const filters = {};

  if (query.userId) {
    filters.user = query.userId;
  }

  if (query.cat) {
    filters.category = query.cat;
  }

  if (query.min || query.max) {
    filters.price = {};

    if (query.min) {
      filters.price.$gt = query.min;
    }

    if (query.max) {
      filters.price.$lt = query.max;
    }
  }

  if (query.search) {
    filters.title = { $regex: query.search, $options: "i" };
  }

  if (query.userId) {
    filters.user = query.userId;
  }

  return filters;
};

export const getAllGigs = async (req, res, next) => {
  const filters = buildFilters(req.query);

  try {
    const gigs = await Gig.find(filters).populate("user");

    if (gigs.length > 0) {
      res.status(200).json({
        message: "Hizmetler alındı",
        gigs,
      });
    } else {
      next(error(404, "Aratılan kriterlere uygun bir hizmet bulunamadı"));
    }
  } catch (err) {
    next(error(500, "Hizmetler alınırken bir sorun oluştu"));
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("user");

    res.status(200).json({
      message: "Hizmet bullundu",
      gig: gig,
    });
  } catch (err) {
    next(error(404, "Bu id'ye sahip bir hizmet bulunamadı"));
  }
};

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(error(403, "Sadece satıcılar hizmet oluşturabilir"));

  const newGig = new Gig({
    user: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();

    res.status(200).json({
      message: "Hizmet başarıyla oluşturuldu",
      gig: savedGig,
    });
  } catch (err) {
    console.log(err);
    next(error(500, "Hizmet oluşturulurken bir sorun oluştu"));
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (gig.user != req.userId)
      return next(
        error(403, "Sadece kendi oluştuduğunuz hizmetleri silebilirsiniz")
      );

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Hizmet başarıyla kaldırıldı" });
  } catch (err) {
    return next(error(500, "Hizmet silinirken bir sorun oluştu"));
  }
};
