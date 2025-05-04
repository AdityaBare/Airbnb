if(process.env.NODE_ENV !="production"){
require('dotenv').config();

}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user.js')


const passport = require('passport');
const LocalStrategy = require('passport-local');


const listingRouter = require('./routes/listing.js');
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
console.log(dbUrl);
main().then(()=>{
    console.log("Mongoose working");
}).catch((err)=>{
    console.log(err);
});
async function main(){
     await mongoose.connect(dbUrl);
}



app.use(cookieParser('secretcode'));
app.use(methodOverride('_method'));
app.set("view engine",'ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);

const store =MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error in MangoDb")
})

const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
   res.locals.success= req.flash('success');
   res.locals.error= req.flash('error');
   res.locals.currentUser = req.user;
   next();
});


app.use('/',userRouter);
app.use('/listings', listingRouter); // this is fine
app.use('/listings/:id/reviews', reviewRouter); // this should be AFTER listingRouter



app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404,"Page Not Found"));

});

app.use((err,req,res,next)=>{
    let {status , message='Page not found'}=err;
    res.render('error.ejs',{err});
});

app.listen(8080,()=>{

    console.log("server runing on port 8080");
});

 