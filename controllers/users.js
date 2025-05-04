const User = require('../models/user');


module.exports.logOut=async (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success',"LogOut Successfuly");
        res.redirect('/listings');
    })
}

module.exports.logInReq=async (req,res)=>{
    console.log("Ok")
    res.render('users/login.ejs');
}

module.exports.logIn =   async (req,res)=>{
    req.flash('success',"Login successfull");
    let redirectUrl =  res.locals.redirectUrl || '/listings';

    res.redirect(redirectUrl);

    
   
    
}

module.exports.signUpReq = async (req,res)=>{
    res.render('users/signup.ejs')

}

module.exports.signUp = async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser = new User({
            username:username,
            email :email
        });
         let registerUser=  await User.register(newUser,password);
         req.login(registerUser,(err)=>{
            if(err){
              return next(err);
            }
            req.flash("success",'SignUp successfully');
            res.redirect('/listings'); 
         })
      
    }
    catch(err){
      req.flash("error",err.message);;
      res.redirect('/signup');
    
    };
    
    
    }