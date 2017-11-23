import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'

const userReducer = handleActions({
  'auth/SIGNIN': (_, action) => action.payload.data.createUser
}, {
  id: '5a115a69daae66614aaceb65',
  name: 'masi'
})

export default combineReducers({
  user: userReducer
})
