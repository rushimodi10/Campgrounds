import { Router } from "express";
const router = Router();
import User from "../models/user.js";
import catchAsyncError from "../utilities/catchAsyncError.js";
import passport from "passport";
import { storeReturnTo } from "../middleware.js";

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsyncError( async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome to Campgrounds!");
            res.redirect("/campgrounds");
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register")
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    });
});

export default router;