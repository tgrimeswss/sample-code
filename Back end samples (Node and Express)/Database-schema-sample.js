const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const courseSchema = new Schema ({
  currentStudents:{type:Array,select:false},
  credentials:{type:Array,select:false},
  instructorids:[{type:ObjectId,select:true}],
  userid:{type:ObjectId,select:true},
  type:{type:String,select:true,default:'course'},
  price: {type:Number,select:true},
  priceType:{type:String,select:true},
  buildKey: {type:String,select:false},
  submitteddocids: {type:Array,select:false},
  registerKey:{type:String,select:false},
  units:[{type:ObjectId,select:false}],
  blackboardContents: {type:Array,select:false},
  name: {type:String,select:true},
  studentGroups: {type:Array,select:true},
  objectives: {type:Array,select:true},
  description: {type:String,select:false},
  category: {type:Array,select:false},
  requirements: {type:Array,select:true},
  ratings: {type:Array,select:false},
  rating:{type:Number,select:true},
  keywords: {type:Array,select:false},
  curriculums: {type:Array,select:false},
  avatar: {type:String,select:true},
  images:{type:Array,select:false},
  published: {type:Boolean,select:false},
  durations: {type:Array,select:false},
  styles: {type:Object,select:false},
  welcomeMessage:{type:String,select:false},
  gradeBook:{type:Array,select:true},
  resources:{type:Array,select:true},
  lastSection:{type:ObjectId,select:true},
})



const Course = mongoose.model('course',courseSchema)
module.exports = Course
