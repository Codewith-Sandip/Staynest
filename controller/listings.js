const Listing = require("../models/listing")


module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs",({allListing}));
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showRoute = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"review",populate: {path : "author"}}).populate("Owner");
    console.log(listing)
    res.render("./listings/show.ejs",{listing});
}

module.exports.createRoute = async (req,res,next)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.Owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","New Listing is created");
        res.redirect("/listings");
    }


module.exports.editRoute = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist")
        res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",({listing ,originalImageUrl}));
}

module.exports.updateRoute = async (req,res)=>{
    if(!req.body.listing){
            throw new ExpressError(400,"send valid listing");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updeted");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteRoute = async (req,res)=>{
    let {id} = req.params;
    const delItem = await Listing.findByIdAndDelete(id);
    console.log(delItem);
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings");
}

module.exports.profileRoute = (req,res)=>{
    let User = res.locals.currUser;
    res.render("./listings/profile.ejs",{User});
}

module.exports.homeRoute = (req,res)=>{
    res.render("./listings/home.ejs");
}

// module.exports.reviewRoute = async (req,res)=>{
//      let listing = await Listing.findById(req.params.id);
//      let newReview = new Review(req.body.review);
//      newReview.author = req.user._id;
//      listing.review.push(newReview);

//      await newReview.save();
//      await listing.save();
//      req.flash("success","New Review is created");
//      res.redirect(`/listings/${listing._id}`);
// }

// module.exports.reviewDeleteRoute = async (req,res)=>{
//      let {id,reviewId} =req.params;

//      await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
//      await Review.findByIdAndDelete(reviewId);
//      req.flash("success","Review Deleted!");
//      res.redirect(`/listings/${id}`);
// }