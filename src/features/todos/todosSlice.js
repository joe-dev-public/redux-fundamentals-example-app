import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

import { client } from '../../api/client'

const initialState = []

// Joe note: tutorial's placeholder data/default todos state:
// const initialState = [
//   { id: 0, text: 'Learn React', completed: true },
//   { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
//   { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
// ]

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//   return maxId + 1
// }

export default function todosReducer(state = initialState, action) {

  switch (action.type) {

    // {type: 'todos/todoAdded', payload: todoText}
    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return [
        ...state,
        // Joe note: if using fake API, the payload it returns is a whole new
        // todo item, so we can just add that:
        action.payload,
        // Joe note: if using the non-API version, this code is needed to add
        // a new item:
        // {
        //   id: nextTodoId(state),
        //   text: action.payload,
        //   completed: false
        // }
      ]
    }

    // Joe todo: compare my code below to tutorial's.
    // https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#handling-additional-actions
    // {type: 'todos/todoToggled', payload: todoId}
    case 'todos/todoToggled': {
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            completed: !todo.completed,
          }
        }
        return todo
      })
    }

    // {type: 'todos/colorSelected', payload: {todoId, color}}
    case 'todos/colorSelected': {
      return state.map((todo) => {
        if (todo.id === action.payload.todoId) {
          return {
            ...todo,
            color: action.payload.color,
          }
        }
        return todo
      })
    }

    // Joe note: assume delete just deletes, rather than setting a flag
    // {type: 'todos/todoDeleted', payload: todoId}
    case 'todos/todoDeleted': {
      return state.filter(({id}) => id !== action.payload)
    }

    // {type: 'todos/allCompleted'}
    case 'todos/allCompleted': {
      return state.map((todo) => {
        return {
          ...todo,
          completed: true,
        }
      })
    }

    // Joe note: I assume the point of this is to delete completed ones...
    // {type: 'todos/completedCleared'}
    case 'todos/completedCleared': {
      return state.filter(({completed}) => completed !== true)
    }

    // Joe note: thunk stuff
    case 'todos/todosLoaded': {
      // Replace the existing state entirely by returning the new value
      return action.payload
    }

    default:
      return state

  }

}


// Joe note: action creator for todosLoaded. (Guessed this before checking
// tutorial code, it's trivial.)
const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}

// Thunk function
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)

  // Joe note: use an action creator instead
  // dispatch({ type: 'todos/todosLoaded', payload: response.todos })
  dispatch(todosLoaded(response.todos))

  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.length)
}


// Joe note: guessing this action creator before checking tutorial code:
const todoAdded = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo
  }
}

// Joe note: I think this function is an e.g. of the "action creator" pattern?
// https://redux.js.org/tutorials/fundamentals/part-6-async-logic#saving-todo-items

// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  // (Joe note: this function is given a name here, but I think it could just
  // as well be anonymous?)
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    // Joe note: as the tutorial says, "we should make an API call to the
    // server with the initial data, wait for the server to send back a copy
    // of the newly saved todo item ..."
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    // "... and then dispatch an action with that todo item":
    dispatch(todoAdded(response.todo))
    // Which they haven't justified, but I assume is a broader web app pattern
    // re using an API like this. (Similar to how you might ask a DB query to
    // return a result, and use that, rather than just using the data that was
    // sent to the DB.)
  }
}

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  state => state.todos,
  (state, somethingElse) => {
    console.log('state', state)
    console.log('somethingElse', somethingElse)
  },
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  todos => todos.map(todo => todo.id)
)

// Joe note: attempting to write this without checking tutorial code:
export const mySelectFilteredTodoIds = createSelector(
  // First input selector: all the todos:
  state => state.todos,
  // Second input selector: the selected status filter:
  state => state.filters.status,
  // Output selector: the filtered list of todos:
  (todos, status) => {
    if (status === "active") {
      return todos.map(todo => {
        if (todo.completed === false) {
          return todo.id
        }
      // Joe note: basic JS stuff, but don't forget: Array.map will return
      // undefined for an element that doesn't return anything. It won't just
      // "skip" that element! One workaround is filtering before/after the map.
      }).filter(element => element !== undefined)
    }
    if (status === "completed") {
      return todos.map(todo => {
        if (todo.completed === true) {
          return todo.id
        }
      }).filter(element => element !== undefined)
    }
    // All:
    return todos.map(todo => todo.id)
  }
)

// Joe note: above works, but the tutorial's approach is also interesting
// because it demonstrates another couple of ideas:
// (1) Use of "multiple selectors in a row" to build one up (see below).
// (2) Awareness of cyclic import dependencies. Standard JS thing, but maybe
// particularly likely in a Redux-y context?

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  state => state.todos,
  // Second input selector: current status filter
  // state => state.filters.status,

  // Second input selector: all filter values
  state => state.filters,

  // Output selector: receives both values
  // (todos, status) => {
  //   if (status === StatusFilters.All) {
  //     return todos
  //   }
  //
  //   const completedStatus = status === StatusFilters.Completed
  //   // Return either active or completed todos based on filter
  //   return todos.filter(todo => todo.completed === completedStatus)
  // }

  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Joe note: here's point (1) from above: this selector essentially "calls"
  // another one. More modular, init!
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filteredTodos => filteredTodos.map(todo => todo.id)
)
