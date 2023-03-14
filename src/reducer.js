// Just a utility to make one bit (?) of code a tad terser.
// https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#combinereducers
import { combineReducers } from "redux"

import filtersReducer from "./features/filters/filtersSlice"
import todosReducer from "./features/todos/todosSlice"

// Joe note: tutorial calls for "default values" in initial state:
// const initialState = {
//   todos: [
//     { id: 0, text: 'Learn React', completed: true },
//     { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
//     { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
//   ],
//   filters: {
//     status: 'All',
//     colors: []
//   }
// }

// Joe note: let's actually start with an emptier initial state, if we can:
// const initialState = {
//   todos: [],
//   filters: {
//     status: 'All',
//     colors: [],
//   },
// }

// Joe note: differing form tutorial, will include todos here but not filters
// (for now).
// const initialState = {
//   todos: [],
// }

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//   return maxId + 1
// }

// Use the initialState as a default value
/*
export default function appReducer(state = initialState, action) {

  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {

    // Do something here based on the different types of actions

    case 'todos/todoAdded': {
      // We need to return a new state object
      return {
        // that has all the existing state data
        ...state,
        // but has a new array for the `todos` field
        todos: [
          // with all of the old todos
          ...state.todos,
          // and the new todo object
          {
            // Use an auto-incrementing numeric ID for this example
            id: nextTodoId(state.todos),
            text: action.payload,
            completed: false
          }
        ]
      }
    }

    // Joe note: attempting to write this one myself based on the tutorial spec
    // before looking at their code. (payload is todoId)
    // Glancing at their code, I can see mine is different, and theirs looks
    // "smarter", but because the rest of the app isn't written, I can't test
    // mine yet.
    case 'todos/todoToggled': {
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.todos[action.payload].id,
            text: state.todos[action.payload].text,
            completed: !state.todos[action.payload].completed,
          },
        ],
      }
    }

    // Joe note: this isn't needed here any more, but this is what my code
    // looked like before I moved this to a slice.
    // case 'filters/statusFilterChanged': {
    //   return {
    //     ...state,
    //     filters: {
    //       ...state.filters,
    //       status: action.payload,
    //     },
    //   }
    // }

    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state

  }
}
*/


// Joe note: this will obviously clash with the appReducer above, so comment
// that when you want to try either of the below:

/*
// Before combineReducers:
export default function rootReducer(state = {}, action) {
  // always return a new object for the root state
  return {
    // Joe note: the names of the properties below aren't a coincidence.
    // They're what we've decided to call the different parts of state. Obvs!

    // the value of `state.todos` is whatever the todos reducer returns
    // todos: todosReducer(state.todos, action),
    // For both reducers, we only pass in their slice of the state
    filters: filtersReducer(state.filters, action)
  }
}
*/
// After combineReducers: slightly shorter!
const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  todos: todosReducer,
  filters: filtersReducer
})

export default rootReducer
