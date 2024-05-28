import { Router } from "express";
const router = Router();
import catchAsyncError from "../utilities/catchAsyncError.js";
import Campground from "../models/campground.js";
import { isLoggedIn } from "../middleware.js";
import { isAuthor } from "../middleware.js";
import { validateCampground } from "../middleware.js";

router.get(
  "/",
  catchAsyncError(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/", isLoggedIn,
  validateCampground,
  catchAsyncError(async (req, res, next) => {
    // if (!req.body.campground)
      //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();

    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    }).populate("author");
    if(!campground){
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit", isLoggedIn, isAuthor,
  catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id", isLoggedIn, isAuthor,
  validateCampground,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id", isLoggedIn, isAuthor,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

export default router;