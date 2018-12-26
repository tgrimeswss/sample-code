import axios from 'axios'
import {
  GET_COURSE,
  QUERY_COURSES,
  GET_COURSE_INFO,
  CLEAR_COURSE,
  CLEAR_COURSE_ID,
  MEMOS,MAX_MEMOS,
  UPDATE_COURSE_PROP,
  LOADING,
  UPDATE_COURSE_PROP_OBJECT,
  MESSAGE,
  GET_STUDENT,
  CONTENT_CREATION_SUCCESS,
  GET_COURSE_RESOURCES,
  ADD_CONTENT_TO_CONTENTS,
  GET_ADDITIONAL_INSTRUCTORS_INFO,
} from './types'



export function clearCourse(){return ({type:CLEAR_COURSE})}
export function clearCourses(){return ({type:QUERY_COURSES,data:[]})}
export function clearCourseID(){return ({type:CLEAR_COURSE_ID})}


//RETURNS COURSEINFO FROM COURSE SCHEMA
export function getCourseInfo(courseid){
  return(dispatch)=>{
    axios.get(`/contents/courses/${courseid}/courseinfo`)
    .then(res=>{
      dispatch({type:GET_COURSE_INFO,payload:res})
    })
  }
}

//RETRIEVES COURSE RESOURCES
export function getCourseResources(courseid){
  return async(dispatch)=>{
    const res = await axios.get(`/contents/courses/${courseid}/resources/get`)
    if(res.data.message==='success'){
      dispatch({type:GET_COURSE_RESOURCES,resources:res.data.resources})
    }
  }
}

export function updateCourseProp(courseid,content,reducerContent){
  return async(dispatch)=>{
    const res = await axios.put(`/contents/courses/${courseid}/update`,content)
    if(reducerContent)content=reducerContent
    if(res.status===200){
      dispatch({type:UPDATE_COURSE_PROP,content})
      dispatch({type:LOADING,data:false})
    }
  }
}

export function getCourseInfoWithUser(courseid){
  return(dispatch)=>{
    axios.get(`/contents/courses/${courseid}/courseinfo/user`)
    .then(res=>{
      dispatch({type:GET_COURSE_INFO,payload:res})
    })
  }
}

//RETURNS ENTIRE COURSE FROM COURSE SCHEMA
export function getCourse(courseid,type,options){
  return async(dispatch)=>{
    const res = await axios.put(`/contents/courses/${courseid}/${type}/all`,options)
    if((res.data.message==='Instructor'||res.data.message==='Registered')&&type==='view'){
      dispatch({type:GET_STUDENT,currentStudent:res.data.student})
    }
    dispatch({type:GET_COURSE,course:res.data.course})
    dispatch({type:MESSAGE,message:res.data.message})
  }
}

//ADDS A NEW COURSE TO THE DB
export function postCourse(data){
  return async(dispatch)=>{
    const res = await axios.post(`/contents/courses/post`,data)
    if(res.data.message==='success'){
      data['_id'] = res.data._id
      dispatch({type:GET_COURSE,data})
      dispatch({type:ADD_CONTENT_TO_CONTENTS,data})
      dispatch({type:LOADING,data:false})
      dispatch({type:CONTENT_CREATION_SUCCESS,message:'Success! Your new course has been created.'})
    }

  }
}

export function changeCourseSuccess(data){
  return ({type:CONTENT_CREATION_SUCCESS,message:data})
}


export function setCourse(course){
  return({type:GET_COURSE,payload:course})
}

export function addCourseInfoArray(courseinfoid,key,data){
  return async(dispatch)=>{
    axios.put(`/contents/courses/updateArray/courseinfo/add`,{courseinfoid,key,data})
    .then(res=>dispatch({type:GET_COURSE_INFO,payload:res}))
  }
}

export function removeCourseInfoArray(courseinfoid,key,data){
  return async(dispatch)=>{
    axios.put(`/contents/courses/updateArray/courseinfo/remove`,{courseinfoid,key,data})
    .then(res=>dispatch({type:GET_COURSE_INFO,payload:res}))
  }
}

export function queryCourseProperty(query,queryProp) {
  return(dispatch)=>{
    axios.get(`/contents/courses/search/${query}/${queryProp}`)
    .then(res => {
      dispatch({type:QUERY_COURSES,payload:res})
    })
  }
}

export function addBBMemo(courseid,content){
  return(dispatch)=>{
    axios.post(`/contents/courses/${courseid}/blackboard/memo/add`,content)
    .then(res=>{
      if(res.data==='Maxium memos exceeded'){dispatch({type:MAX_MEMOS,data:true})}
      else {dispatch({type:MEMOS,payload:res})}
    })
  }
}

export function acPropObj(courseid,propName,content){
  return async(dispatch)=>{
    const res = await axios.put(`/contents/courses/${courseid}/${propName}/object/update`,content)
    if(res.status===200){
      dispatch({type:UPDATE_COURSE_PROP_OBJECT,propName,content})
    }
  }
}

export function getMemos(courseid){
  return(dispatch)=>{
    axios.get(`/contents/courses/${courseid}/blackboard/memo/get/all`)
    .then(res=>{
      dispatch({type:MEMOS,payload:res})
    })
  }
}

export function editMemoPosition(courseid,memoid,content){
  return(dispatch)=>{
    axios.put(`/contents/courses/${courseid}/blackboard/memo/${memoid}/position`,content)
    .then(res=>{
      dispatch({type:MEMOS,payload:res})
    })
  }
}

export function editMemoContent(courseid,memoid,key,content){
  return(dispatch)=>{
    axios.put(`/contents/courses/${courseid}/blackboard/memo/${memoid}/content`,{key:key,content:content})
    .then(res=>{
      dispatch({type:MEMOS,payload:res})
    })
  }
}

export function changeMaxMemos(bool){
  return({type:MAX_MEMOS,data:bool})
}

export function removeMemo(courseid,memoid){
  return(dispatch)=>{
    axios.delete(`/contents/courses/${courseid}/blackboard/memo/${memoid}/remove`)
    .then(res=>{
      dispatch({type:MEMOS,payload:res})
    })
  }
}

export function getAdditionalInstructorInfo(courseid){
  return async(dispatch)=>{
    const res = await axios.get(`/contents/courses/${courseid}/instructors/get`)
    if(res.status===200){
      dispatch({type:GET_ADDITIONAL_INSTRUCTORS_INFO,instructorids:res.data})
    }
  }
}
