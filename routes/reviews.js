import { Router } from "express";
const router = Router({ mergeParams: true });
import catchAsyncError from "../utilities/catchAsyncError.js";
import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middleware.js";



router.post(
  "/", isLoggedIn,
  validateReview,
  catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId", isLoggedIn, isReviewAuthor,
  catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Campground.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

export default router;