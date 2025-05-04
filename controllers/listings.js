const { model } = require('mongoose');
const Listing = require('../models/listing');
const listing = require('../models/listing');

module.exports.index =async (req,res)=>{
   let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});


}

module.exports.addRoute = async (req,res,next)=>{
     const url = req.file.path;
    const filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);

    const place = req.body.listing.location;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      newlisting.geometry = {
        type: "Point",
        coordinates: [lon, lat]  // GeoJSON format: [longitude, latitude]
      };

     
    }

    newlisting.image = { url, filename };
    newlisting.owner = req.user._id;

    await newlisting.save();
   

    req.flash('success', 'New listing created!');
    res.redirect('/listings');
}
module.exports.showRoute = async (req,res)=>{
    let {id}=req.params;
  let list =  await Listing.findById(id)
  .populate({path:"reviews",
     populate:{
    path:"author"
},
} )
  .populate('owner');
  if(!list){
  req.flash('error',"Listing you requested does not exist");
  return res.redirect('/listings');
  }


  res.render('listings/show.ejs',{list});
}



module.exports.editRoute=async (req,res)=>{
    const {id} = req.params;
    const list = await Listing.findById(id);
   
    if(!list){
        req.flash('error',"Listing you requested does not exist");
       return res.redirect('/listings');
        }
   let orignalImageUrl =  list.image.url;
   orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_250")
    res.render('listings/edit.ejs',{list,orignalImageUrl});
}


module.exports.updateRoute = async (req,res)=>{
     const {id}=req.params;
     let {title,price,country,location,description}=req.body;
     let listing=await Listing.findByIdAndUpdate(id,{title:title,price:price,country:country,location:location,description:description }) 
     if( typeof req.file !=="undefined"){ 
        let url=req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash('success','Listing Updated')
    res.redirect(`/listings/${id}`);
}


module.exports.deleteRoute= async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing is deleted');
    res.redirect('/listings');
}


module.exports.searchRoute=async (req,res)=>{
  let data = req.body.data;
  let list = await Listing.find({$or:[{location:data},{title:data},{country:data}]});
  if(list.length>0){
    return res.render("listings/search.ejs", {allListings: list});
  }
  req.flash('error',"List not Found")
  res.redirect('/listings');

}