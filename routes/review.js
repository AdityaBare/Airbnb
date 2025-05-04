const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner,isReviewAuthor ,validatereview} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');



// Review Route
router.post("/",
   validatereview,
   isLoggedIn,
   wrapAsync(reviewController.newReview)
);


// Review Delete Route
router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
   wrapAsync(reviewController.deleteReview));

module.exports=router;