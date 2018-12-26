#!/usr/bin/env nodejs
require('dotenv/config')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const path = require('path')
const keys = require('./config/keys')



require('./services')
require('./models/User')
require('./models/Course')
require('./models/Curriculum')
require('./models/Module')
require('./models/Category')
require('./models/Section')
require('./models/Subcategory')
require('./models/Tool')
require('./models/Notification')
require('./models/BlackboardMemo')
require('./models/LiveClass')
require('./models/Response')
require('./models/Student')
require('./models/Material')
require('./models/StudentGroup')
require('./models/MarkingSegment')
require('./models/Grade')
require('./models/Resource')
require('./models/Submission')
require('./models/Unit')


const app = express()


app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({maxAge: 30*24*60*60*1000,keys: [keys.cookieKey]}))

app.use(passport.initialize())
app.use(passport.session())


mongoose.Promise=global.Promise

if(process.env.NODE_ENV==='production'){
  mongoose.connect(keys.mLabUrl)
} else {
  mongoose.connect(keys.mongoDB,{useNewUrlParser:true})
}


require('./services/Mailer')(app)
require('./routes/toolRoutes')(app)
require('./routes/contentRoutes')(app)
require('./routes/authRoutes')(app)
require('./routes/courseRoutes')(app)
require('./routes/curriculumRoutes')(app)
require('./routes/userRoutes')(app)
require('./routes/fileRoutes')(app)
require('./routes/moduleRoutes')(app)
require('./routes/sectionRoutes')(app)
require('./routes/quizRoutes')(app)
require('./routes/materialRoutes')(app)
require('./routes/liveClassRoutes')(app)
require('./routes/notificationRoutes')(app)
require('./routes/paymentRoutes')(app)
require('./routes/generalRoutes')(app)
require('./routes/projectRoutes')(app)
require('./routes/studentRoutes')(app)
require('./routes/unitRoutes')(app)



if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'))
  app.get('/', (req, res)=>res.sendFile(path.join(__dirname,'client/build/index.html')))
}


const PORT = process.env.PORT || 4000
const server = app.listen(PORT)

require('./sockets')(server)
require('./sockets/communitySocket')(server)
require('./sockets/notificationSocket')(server)

console.log('Listening on port: '+PORT)
