const mongoose = require('mongoose')
let {Schema} = mongoose
const {ObjectID} = require('mongodb')
const Course = require('../models/Course')
const Module = require('../models/Module')
const Section = require('../models/Section')
const Student = require('../models/Student')
const Unit = require('../models/Unit')
const User = require('../models/User')
const MarkingSegment = require('../models/MarkingSegment')
const Material = require('../models/Material')
const BlackboardMemo = require('../models/BlackboardMemo')
const StudentGroup = require('../models/StudentGroup')
const uuid = require('uuid')



module.exports = (app) => {

  //ADDS A NEW COURSE IN THE COURSE SCHEMA
  app.post('/contents/courses/post',async (req,res)=>{
    const buildKey = uuid()
    const registerKey = uuid()
    const newCourse = await new Course({userid:ObjectID(req.user._id),instructorids:[ObjectID(req.user._id)],buildKey,registerKey,resources:[],...req.body}).save()
    const updatedUser = await User.findOneAndUpdate({_id:req.user._id},{$push:{contentKeys:buildKey}})
    if(updatedUser._id&&newCourse._id)res.send({message:'success',_id:newCourse._id})
    else res.send({message:'Fail'})
  })

  //QUERY'S A COURSE BY PROPNAME
  app.get('/contents/courses/search/:query/:queryprop',async(req,res)=>{
    const {query,queryprop} = req.params
    const foundCourses = await Course.find({[queryprop]:{$regex:query,$options:'i'}})
    .select('-description -objectives -prerequisites -ratings -curriculums -images -categories -duration')
    .lean().exec((err,data)=>{
      res.send(data)
    })

  })

  //UPDATES A PROPERTY IN THE COURSE SCHEMA
  app.put('/contents/courses/:courseid/update',async(req,res)=>{
    const {courseid} = await req.params
    const updatedCourse = await Course.findOneAndUpdate({_id:courseid,userid:req.user._id},{$set:req.body})
    if(updatedCourse)res.sendStatus(200)
    else res.sendStatus(404)
  })

  //GETS TOTAL COURSE FROM COURSE SCHEMA FOR BUILDING INSTRUCTOR
  app.put('/contents/courses/:courseid/build/all',async (req,res)=>{
    const {courseid,type} = req.params
    const foundCourse = await Course.findOne({
      _id:courseid,
      buildKey:{$in:req.user.contentKeys}
    })
    .select(`units modules blackboardContents description durations styles welcomeMessage`)
    .populate({path:'units',model:Unit,select:'modules'})
    .populate({path:'gradeBook',model:MarkingSegment})
    .populate({path:'instructorids',model:User})
    .populate({path:'studentGroups',model:StudentGroup})
    .exec((err,data)=>{
      if(data!==null){
        res.send({course:data,message:'Instructor'})
      } else {
        data={message:'Non instructor'}
        res.send(data)
      }
    })
  })

  //GETS TOTAL COURSE FROM COURSE SCHEMA FOR STUDENT VIEWING
  app.put('/contents/courses/:courseid/view/all',async (req,res)=>{
    const {courseid} = req.params
    const foundStudent = await Student.findOne({userid:req.user._id,contentid:courseid})
    const foundCourse = await Course.findOne({_id:courseid,registerKey:{$in:req.user.contentKeys}})
    .select(`modules blackboardContents description durations styles registerKey welcomeMessage`)
    .populate({path:'units',model:Unit,select:'modules'})
    .populate({path:'userid',model:User})
    .exec((err,data)=>{
      if(err||data===null){
        data={message:'Unregistered',_id:courseid}
        res.send(data)
      } else if(req.user.contentKeys.includes(data.registerKey)){
        res.send({course:data,message:'Registered',student:foundStudent})
      } else {
        res.send({message:'Unregistered'})
      }
    })


  })


  //GETS COURSEINFO FROM COURSE SCHEMA
  app.get('/contents/courses/:courseid/courseinfo/user',async (req,res)=>{
    const {courseid} = req.params
    const foundCourseInfo = await Course.findOne({_id:courseid})
    .populate({path:'userid',model:User})
    .populate({path:'modules',model:Module})
    .exec((err,data)=>{
      Section.populate(data, {path: 'modules.sections',select: 'name'},()=>{
        res.send(data)
      })
    })

  })

  //POSTS A NEW MEMO TO COURSE BLACKBOARD
  app.post('/contents/courses/:courseid/blackboard/memo/add',async(req,res)=>{
    const {courseid} = await req.params
    const {x,y} = await req.body
    const foundMemos = await BlackboardMemo.find({courseid:courseid})
    if(foundMemos.length>=10){res.send('Maxium memos exceeded')}
    else {
      const newMemo = await new BlackboardMemo({title:'Title here',x:x,y:y,description:'Description here',courseid:courseid.toString()}).save()
      const allMemos = await BlackboardMemo.find({courseid:courseid})
      res.send(allMemos)
    }
  })

  //GETS ALL MEMOS FROM COURSE
  app.get('/contents/courses/:courseid/blackboard/memo/get/all',async(req,res)=>{
    const {courseid} = req.params
    const foundMemos = await BlackboardMemo.find({courseid:courseid})
    res.send(foundMemos)
  })

  //EDITS THE X AND Y POSITION OF THE MEMO
  app.put('/contents/courses/:courseid/blackboard/memo/:memoid/position',async(req,res)=>{
    const {courseid,memoid} = req.params
    const {x,y} = req.body
    const updateMemo = await BlackboardMemo.findOneAndUpdate({_id:memoid},{$set:{x:x,y:y}})
    const foundMemos = await BlackboardMemo.find({courseid:courseid})
    res.send(foundMemos)
  })

  //EDITS THE TITLE AND DESCRIPTION OF THE MEMO
  app.put('/contents/courses/:courseid/blackboard/memo/:memoid/content',async(req,res)=>{
    const {courseid,memoid} = req.params
    const {key,content} = req.body
    const setProp = await {$set: {}}
    setProp.$set[key] = content
    const updateMemo = await BlackboardMemo.findOneAndUpdate({_id:memoid},setProp)
    const foundMemos = await BlackboardMemo.find({courseid:courseid})
    res.send(foundMemos)
  })

  //DELETES A MEMO
  app.delete('/contents/courses/:courseid/blackboard/memo/:memoid/remove',async(req,res)=>{
    const {courseid,memoid} = await req.params
    const foundMemo = await BlackboardMemo.findOne({_id:memoid}).remove()
    const foundMemos = await BlackboardMemo.find({courseid:courseid})
    res.send(foundMemos)
  })

  //UPDATES A PROP OBJECT INSIDE COURSE SCHEMA (EX: STYLES OBJ)
  app.put('/contents/courses/:courseid/:prop/object/update',async(req,res)=>{
    const {courseid,prop} = req.params
    const updatedCourse = await Course.findOneAndUpdate(
      {_id:courseid},
      {
        $set:{[prop]:req.body}
      },
      {upsert:true}
    )
    if(updatedCourse)res.sendStatus(200)
    else res.sendStatus(404)
  })

  //GETS COURSE RESOURCES
  app.get('/contents/courses/:courseid/resources/get',async(req,res)=>{
    const {courseid} = req.params
    const foundCourse = await Course.findOne({_id:courseid,$or:[{buildKey:{$in:req.user.contentKeys}},{registerKey:{$in:req.user.contentKeys}}]})
    .populate({path:'resources',model:Material,select:'content'})
    if(foundCourse)res.send({message:'success',resources:foundCourse.resources})
    else res.sendStatus(404)
  })

  //ADDS OR REMOVES RESOURCES FROM A COURSE
  app.put('/contents/courses/:courseid/resources/:type/resourceid',async(req,res)=>{
    const {courseid,type,resourceid} = req.params
    let foundCourse = null
    if(type==='add'){
      const newResource = new Material({})
      foundCourse = await Course.findOneAndUpdate({_id:courseid,$or:[{buildKey:{$in:req.user.contentKeys}},{registerKey:{$in:req.user.contentKeys}}]},{$push:newResource._id})
    } else {
      foundCourse = await Course.findOneAndUpdate({_id:courseid,$or:[{buildKey:{$in:req.user.contentKeys}},{registerKey:{$in:req.user.contentKeys}}]},{$pull:ObjectID(resourceid)})
    }
  })

  app.get('/contents/courses/:courseid/instructors/get',async(req,res)=>{
    const {courseid} = req.params
    const foundCourse = await Course.findOne({_id:courseid}).populate({path:'instructorids',model:User})
    if(foundCourse)res.send(foundCourse.instructorids)
    else res.sendStatus(404)
  })

}
