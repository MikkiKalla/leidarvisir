const Mongoose = require("mongoose");

const oCourseSchema = new Mongoose.Schema({
  field_name: {
    type: String,
    required: true
  }
  // Studies: String,
  // level: String,
  // Units: Number,
  // Degree: String,
  // home_link: String,
  // // school:"",
  // Details: {
  //   Image1: String,
  //   Image2: String,
  //   Image3: String,
  //   Image4: String,
  //   Application_link: String,
  //   Intro: String,
  //   About_course: String,
  //   Requirements: String,
  //   future_work: String,
  //   Course_abroad: String,
  //   Student_body: String,
  //   sEmail: String,
  //   contact: {
  //     contact_1: String,
  //     contact_2: String,
  //     contact_3: String
  //   }//end contact
  // }//end details
})

const mCourse = Mongoose.model("Course", oCourseSchema);

module.exports = {mCourse}
