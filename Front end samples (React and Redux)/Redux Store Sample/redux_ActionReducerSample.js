import {
  QUERY_COURSES,
  QUERY_COURSE_PROPERTY,
  GET_COURSE,
  GET_COURSE_INFO,
  CLEAR_COURSE,
  MEMOS,
  MAX_MEMOS,
  UPDATE_COURSE_PROP,
  DELETE_MODULES_FROM_COURSE,
  UPDATE_COURSE_PROP_OBJECT,
  CREATE_NEW_MARKING_SEGMENT,
  CREATE_NEW_STUDENT_GROUP,
  REMOVE_STUDENT_GROUP,
  REMOVE_MARKING_SEGMENT,
  UPDATE_STUDENT_GROUP,
  UPDATE_MARKING_SEGMENT,
  GET_COURSE_RESOURCES,
  ADD_MATERIAL_TO_COURSE_RESOURCES,
  REMOVE_MATERIAL_FROM_COURSE_RESOURCES,
  GET_ADDITIONAL_INSTRUCTORS_INFO,
  ADD_UNIT,
  UPDATE_UNIT,
  REMOVE_UNIT_FROM_COURSE,
} from '../actions/types'
import update from 'react-addons-update'


let initialState = {
  courses: [],
  currentCourseInfo: {},
  currentCourse: {
    units:[],
    gradebook:[],
    studentGroups:[],
    styles:{},
  },
  memos: [],
  maxMemos: false,
}

function storeData(state=initialState,action) {
  switch(action.type) {
    case GET_COURSE:
      return {
        ...state,
        currentCourse: action.course||action.data||false
      }
    case UPDATE_COURSE_PROP:
      return update(state,{
        currentCourse:{
          $merge:action.content
        }
      })
    case CREATE_NEW_MARKING_SEGMENT:
      return update(state,{
        currentCourse:{
          gradeBook:{
            $push:[action.data]
          }
        }
      })
    case CREATE_NEW_STUDENT_GROUP:
      return update(state,{
        currentCourse:{
          studentGroups:{
            $push:[action.data]
          }
        }
      })
    case UPDATE_COURSE_PROP_OBJECT:{
      return update(state,{
        currentCourse:{
          [action.propName]:{
            $merge:action.content
          }
        }
      })
    }
    case QUERY_COURSES:
      return {
        ...state,
        courses: action.data || action.payload.data || []
      }
    case QUERY_COURSE_PROPERTY:
      return {
        ...state,
        courses: action.payload.data
      }
    case GET_COURSE_INFO:
      return {
        ...state,
        currentCourseInfo: action.payload.data
      }
    case DELETE_MODULES_FROM_COURSE:
      return update(state,{
        currentCourse:{
          modules:action.filteredModules
        }
      })
    case CLEAR_COURSE:
      return {
        ...state,
        currentCourseInfo:{}
      }
    case MEMOS:
      return {
        ...state,
        memos:action.payload.data
      }
    case MAX_MEMOS:
      return {
        ...state,
        maxMemos: action.data
      }
    case UPDATE_MARKING_SEGMENT:
      return update(state,{
        currentCourse:{
          gradeBook:{
            [action.i]:{
              $merge:action.content
            }
          }
        }
      })
    case REMOVE_MARKING_SEGMENT:
      return update(state,{
        currentCourse:{
          gradeBook:{
            $splice:[[state.currentCourse.gradeBook.map((e)=>{return e._id}).indexOf(action._id),1]]
          }
        }
      })
    case UPDATE_STUDENT_GROUP:
      return update(state,{
        currentCourse:{
          studentGroups:{
            [action.i]:{
              $merge:action.content
            }
          }
        }
      })
    case REMOVE_STUDENT_GROUP:
      return update(state,{
        currentCourse:{
          studentGroups:{
            $splice:[[state.currentCourse.studentGroups.map((e)=>{return e._id}).indexOf(action._id),1]]
          }
        }
      })
    case GET_COURSE_RESOURCES:
      return update(state,{
        currentCourse:{
          $merge:{
            resources:action.resources
          }
        }
      })
    case ADD_MATERIAL_TO_COURSE_RESOURCES:
      return update(state,{
        currentCourse:{
          resources:{
            $push:[action.material]
          }
        }
      })
    case REMOVE_MATERIAL_FROM_COURSE_RESOURCES:
      return update(state,{
        currentCourse:{
          resources:{
            $splice:[[state.currentCourse.resources.map((e)=>{return e._id}).indexOf(action.materialid),1]]
          }
        }
      })
    case GET_ADDITIONAL_INSTRUCTORS_INFO:
      return update(state,{
        currentCourse:{
          $merge:{
            instructorids:action.instructorids
          }
        }
      })
    case ADD_UNIT:
      return update(state,{
        currentCourse:{
          units:{
            $push:[action.dataObj]
          }
        }
      })
    case UPDATE_UNIT:
      return update(state,{
        currentCourse:{
          units:{
            [state.currentCourse.units.map((e)=>e._id).indexOf(action.unitid)]:{
              $merge:action.content
            }
          }
        }
      })
    case REMOVE_UNIT_FROM_COURSE:
      return update(state,{
        currentCourse:{
          units:{
            $splice:[[state.currentCourse.units.map((e)=>e._id).indexOf(action.unitid),1]]
          }
        }
      })
    default:
      return state
  }
}

export default storeData
