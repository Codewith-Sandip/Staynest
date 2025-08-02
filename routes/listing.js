// const express = require("express");
// const router = express.Router;
// // const wrapAsync = require("../utils/wrapAsync.js");
// // const ExpressError = require("../utils/ExpressError.js");
// // const {listingSchema,reviewSchema} = require("../schema.js");
// // const Listing = require("../models/listing.js");

// const Listing = require("../models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
// const Review = require("../models/review.js");


// //validate schema middleware
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

// //Index route
// router.get("/",wrapAsync(async (req,res)=>{
//     const allListing = await Listing.find({});
//     res.render("./listings/index.ejs",({allListing}));
// }))    

// //create new list
// router.get("/new",(req,res)=>{
//     res.render("./listings/new.ejs");
// })


// //show route
// router.get("/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("review");
//     res.render("./listings/show.ejs",{listing});
// }))

// //create route
// router.post("/",wrapAsync(async (req,res,next)=>{
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     }))


// //edit route
// router.get("/:id/edit",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",({listing}));
// }))    


// //update route
// router.put("/:id",wrapAsync(async (req,res)=>{
//     if(!req.body.listing){
//             throw new ExpressError(400,"send valid listing");
//     }
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }))

// //delete route
// router.delete("/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const delItem = await Listing.findByIdAndDelete(id);
//     console.log(delItem);
//     res.redirect("/listings");
// }))


// module.exports = router;