const initData = require('./data.js');
const Listing = require('../models/listing.js');
const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("Mongoose working");
    await initDB();  // Ensure the database connection is established before initializing DB
  } catch (err) {
    console.error('Mongoose connection error:', err);
  }
}

const initDB = async () => {
  try {
    // Adding owner to each item in the data
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '680bb686e2118e2e0ca1fab6' }));
    
    // Inserting data into the database
    await Listing.insertMany(initData.data);
    console.log("Data inserted successfully");
  } catch (err) {
    console.error('Error inserting data:', err);
  }
};

main();
