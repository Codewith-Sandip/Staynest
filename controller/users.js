const User =require("../models/user");

module.exports.renderSignup = (req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.userSignup = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({
        email,
        username
      })
    const regUser = await User.register(newUser,password);
    req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Welcome to Staynest");
            res.redirect("/listings");
        }
    })
    }catch(err){
        req.flash("error","Something went wrong");
        res.redirect("/signup");
    }

}

module.exports.renderLogin = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Staynest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next();
        }else{
            req.flash("success","Logout Scuccessfully");
            res.redirect("/listings")
        }
    })
}