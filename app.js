// env access
if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn, isOwner, isReviewAuthor} = require("./middleware.js");
//user routes
const userRoute = require("./routes/user.js");
//controller
const listingController = require("./controller/listings.js");
const reviewController = require("./controller/reviews.js");
//upload image
const { storage } = require("./cloudConfig.js");
const multer  = require('multer');
const { access } = require("fs");
const { error } = require('console');
const upload = multer({ storage })


//Middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);


//Database mongoose connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
    .then(()=>{
        console.log("database connected successfully");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}


//validate schema middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

const store =MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET,
  },
    touchAfter: 24 * 3600,
})

store.on("error",()=>{
    console.log("error in mongo session",err);
})

// session section
const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 60 * 60 * 60 * 1000,
        maxAge: 7 * 60 * 60 * 60 * 1000,
        httpOnly: true,
    }
}





app.use(session(sessionOption));
app.use(flash());


//User login authenticate
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash msg
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// all routes

//use of user router
app.use("/",userRoute);


//privacy terms
app.get("/privacy",(req,res)=>{
    res.render("./listings/privacy.ejs")
})

app.get("/terms",(req,res)=>{
    res.render("./listings/terms.ejs")
})

// profile view route
app.get("/profile",isLoggedIn,listingController.profileRoute);

//review delete route
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

//review route
app.post("/listings/:id/review",isLoggedIn,wrapAsync(reviewController.createReview))


//delete route
app.delete("/listings/:id",isLoggedIn,wrapAsync(listingController.deleteRoute))

//update route
app.put("/listings/:id",isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateRoute))

//edit route
app.get("/listings/:id/edit",isLoggedIn,wrapAsync(listingController.editRoute))

//create route
app.post("/listings",isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createRoute))

//create new list
app.get("/listings/new",isLoggedIn,listingController.renderNewForm)

//show route
app.get("/listings/:id",wrapAsync(listingController.showRoute))

//all listing main(index route)
app.get("/listings",wrapAsync(listingController.index));

//Home route
app.get("/",listingController.homeRoute)




//for all error route
//error handeling middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Page not found"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message})
})

//port connection
app.listen(8080,()=>{
    console.log("app listening on port 8080");
})

