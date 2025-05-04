const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync =require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner,validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js')
const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage })

// New Rout
router.get('/new',isLoggedIn,(req,res)=>{
    
    res.render("listings/new.ejs");

})


router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.addRoute)
);


router.route('/:id')
.get(wrapAsync(listingController.showRoute))
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteRoute));





//Search Route

router.post('/search',listingController.searchRoute)

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editRoute));

// Update Route

router.put('/:id/update',
    isLoggedIn,
    isOwner,
    upload.single('image')    
    ,wrapAsync(listingController.updateRoute));


module.exports=router;
