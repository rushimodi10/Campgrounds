import Campground from "./models/campground.js";
import Review from "./models/review.js";
import { campgroundSchema, reviewSchema } from "./validationSchemas.js";
import ExpressError from "./utilities/ExpressError.js";

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("error", "You must be signed in!");
      return res.redirect("/login");
    }
    next();
}

export const storeReturnTo = (req, res, next) => {
  if(req.session.returnTo){
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

export const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};