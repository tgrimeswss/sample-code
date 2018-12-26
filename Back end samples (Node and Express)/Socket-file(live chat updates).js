const socket = require('socket.io')
const url = require('url')
const {addMessageToChat} = require('../routes/chatRoutes')


const rooms = ['community']

let clients = []
let clientIndex =(id)=>{
  if(clients.map((e)=>e.userid).indexOf(id)>-1)return true
  else return false
}

module.exports=(server)=>{

  const io = socket(server)

  io.of('/course').on('connection',(socket)=>{
    const {userid,courseid,firstName,lastName,avatar} = socket.handshake.query
    let user = {userid,courseid,firstName,lastName,avatar}

    socket.on(`${courseid}-join`,(room)=>{
      if(rooms.includes(room)){

        if(clientIndex(userid)){
          socket.emit('users',clients)
        } else {
          clients.push(user)
          socket.emit('users',clients)
        }

        socket.join(room)
        socket.emit({connection:'success'})

        socket.on('message',(data)=>{
          socket.to('community').emit('message',data)
          addMessageToChat(data)
        })

        socket.on(`${courseid}-exit`,(data)=>{
          clients.splice(clients.map((e)=>e._id).indexOf(data._id),1)
          socket.to('community').emit('users',clients)
          socket.disconnect()
        })


      } else {
        console.log('error')
        socket.emit('err, something went wrong')
      }
    })

  })





}
