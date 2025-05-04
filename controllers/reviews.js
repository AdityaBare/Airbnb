const Review = require('../models/review');
const Listing = require('../models/listing');

 
module.exports.newReview=async (req, res, next) => {
      let { id } = req.params;

          console.log(id);
          console.log(Listing);
          const listing = await Listing.findOne({ _id: id });  // fallback for testing

console.log('listing found?', listing);  // should not be null

      
    //   let listing = await Listing.findById(id);
    //   console.log(listing);
      const newReview = new Review(req.body.review);
      newReview.author = req.user._id; //   Assign the current user as the author

      await newReview.save();

      listing.reviews.push(newReview);
      await listing.save();

      req.flash('success', 'New Review Created!');
      res.redirect(`/listings/${id}`);
   }

   module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash('success','Review is deleted');
   res.redirect(`/listings/${id}`);
   
   
   
   }