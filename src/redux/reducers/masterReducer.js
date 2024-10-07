import { actionType } from '../actions/actionType'
import { fromJS } from 'immutable'

function initialState() {
  return fromJS(
    {
      MasterKey: null,
      Multi: false,
      Dark: false,
      MainDB: null,
      AvatarImage: {}
    }
  )
}

export default function reducer(state = initialState(), action) {
  if (typeof reducer.prototype[action.type] === "function") {
    return reducer.prototype[action.type](state, action)
  } else {
    return state
  }
}

reducer.prototype[actionType.master.setMasterKey] = (state, action) => {
  return state.set('MasterKey', action.master_key)
}

reducer.prototype[actionType.master.setMulti] = (state, action) => {
  return state.set('Multi', action.multi)
}

reducer.prototype[actionType.master.setDark] = (state, action) => {
  return state.set('Dark', action.dark)
}

reducer.prototype[actionType.master.setMainDB] = (state, action) => {
  return state.set('MainDB', action.db)
}

reducer.prototype[actionType.master.setAvatarImage] = (state, action) => {
  return state.set('AvatarImage', action.avatar_image)
}