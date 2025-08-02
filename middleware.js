const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    try{
        if(!req.isAuthenticated()){
             req.session.redirectUrl = req.originalUrl;
             req.flash("error","Please login before creating new list");
             return res.redirect("/login");
    }
    next();
    }catch(err){
        console.log(err);
    }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    try{
        if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    }catch(err){
        console.log(err)
    }
}


module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.Owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}