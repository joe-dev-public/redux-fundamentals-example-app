export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

// Joe note: the initialState and reducers just return the object that will
// contain the filters state. (They naturally don't need to return an
// object with a filters: property whose value is an object...)

const initialState = {
  status: 'All',
  colors: [],
}

function handleColorChange(currentColors, changedColor, changeType) {
  // Joe todo: this code might need to change depending on how the action is
  // implemented!
  // Joe note: interesting question that I'm not sure of the answer to off the
  // top of my head: if we pass an array as a parameter, then mutate the array
  // here, I'm guessing that will change the original array? So we'd need to
  // clone the array. (Probably fairly safe to conclude that this is how things
  // work, given this is the *entire* pattern for all the reducer code we've
  // been working with so far, right? :¬)
  if (changeType === 'added') {
    return [...currentColors, changedColor]
  }
  if (changeType === 'removed') {
    return currentColors.filter(color => color !== changedColor)
  }
}

export default function filtersReducer(state = initialState, action) {

  switch (action.type) {

    // Joe note: initially wrote this before looking at tutorial code, and it
    // was an exact match 😎
    // {type: 'filters/statusFilterChanged', payload: filterValue}
    case 'filters/statusFilterChanged': {
      return {
        // Joe note: we don't need to specify the "filters" property of the
        // state here, because we're going to call this function with "filters"
        // as its state (in reducer.js, when we combine reducers).
        // (As the tutorial says: "The state parameter is different for every
        // reducer, and corresponds to the part of the state it manages.")
        // https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#combining-reducers
        ...state,
        status: action.payload,
      }
    }

    // {type: 'filters/colorFilterChanged', payload: {color, changeType}}
    case 'filters/colorFilterChanged': {
      return {
        ...state,
        colors: handleColorChange(state.colors, action.payload.color, action.payload.changeType)
      }
    }

    default:
      return state
  }

}
