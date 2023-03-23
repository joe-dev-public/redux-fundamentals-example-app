import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

import { client } from '../../api/client'

const initialState = {
  status: 'idle', // or: 'loading', 'succeeded', 'failed'
  entities: {},
}

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

    case 'todos/todoAdded': {
      const todo = action.payload
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo,
        },
      }
    }

    // {type: 'todos/todoToggled', payload: todoId}
    case 'todos/todoToggled': {
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed,
          },
        },
      }
    }

    // {type: 'todos/colorSelected', payload: {todoId, color}}
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color,
          },
        },
      }
    }

    // {type: 'todos/todoDeleted', payload: todoId}
    case 'todos/todoDeleted': {
      const todoId = action.payload
      const newEntities = { ...state.entities }
      delete newEntities[todoId]
      return {
        ...state,
        entities: { ...newEntities },
      }
    }

    // {type: 'todos/allCompleted'}
    case 'todos/allCompleted': {
      const newEntities = { ...state.entities }
      // Joe note: I took a slightly different approach to tutorial; I think
      // both are fine.
      for (const todo in newEntities) {
        newEntities[todo].completed = true
      }
      return {
        ...state,
        entities: { ...newEntities },
      }
    }

    // Joe note: i.e. delete completed todos. Bad naming!
    // {type: 'todos/completedCleared'}
    case 'todos/completedCleared': {
      const newEntities = { ...state.entities }
      for (const todo in newEntities) {
        if (newEntities[todo].completed === true) {
          delete newEntities[todo]
        }
      }
      return {
        ...state,
        entities: { ...newEntities },
      }
    }

    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading',
      }
    }

    // Joe note: don't forget this is the action that essentially loads all
    // of the data we get from the (fake) API into state.
    case 'todos/todosLoaded': {
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities,
      }
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

// Joe note: action creator for todosLoading. Tutorial ... didn't include the
// code for this in the actual tutorial? (It's probably in a repo tag.)
const todosLoading = () => ({ type: 'todos/todosLoading' })

// Thunk function
// Joe note: "While fetchTodos doesn't take any parameters, we could still
// wrap it in an action creator as well"
// (https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#using-action-creators)
// export function fetchTodos() {
//   return async function fetchTodosThunk(dispatch, getState) {
//     const response = await client.get('/fakeApi/todos')

//     const stateBefore = getState()
//     console.log('Todos before dispatch: ', stateBefore.todos.length)

//     // Joe note: use an action creator instead
//     // dispatch({ type: 'todos/todosLoaded', payload: response.todos })
//     dispatch(todosLoaded(response.todos))

//     const stateAfter = getState()
//     console.log('Todos after dispatch: ', stateAfter.todos.length)
//   }
// }

// Joe note: same as above but terser arrow function (tutorial omits getState
// stuff/logging).
export const fetchTodos = () => async (dispatch, getState) => {
  // Joe note: async request status stuff: dispatch   
  dispatch(todosLoading())

  const response = await client.get('/fakeApi/todos')

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.entities.length)

  // Joe note: use an action creator instead
  // dispatch({ type: 'todos/todosLoaded', payload: response.todos })
  dispatch(todosLoaded(response.todos))

  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.entities.length)
}


// Joe note: guessing this action creator before checking tutorial code:
// const todoAdded = todo => {
//   return {
//     type: 'todos/todoAdded',
//     payload: todo
//   }
// }

// Joe note: same as above but implicit return for terseness (also exported
// for possibly no good reason, but just because tutorial code does this)
export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })


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

// Joe note: updating for normalization
// export const selectTodos = state => state.todos.entities

const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, entities =>
  Object.values(entities)
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}


export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
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

// export const selectTodoById = (state, todoId) => {
//   return selectTodos(state).find(todo => todo.id === todoId)
// }


// Joe note: this is a copy of mySelectFilteredTodoIds above, but with extra
// code added to interrogate how createSelector handles params (and the basic
// JS business of passing functions and params around works, in detail). I've
// also split the basic inputs out into separate functions (which is something
// the tutorial wants us to do next in any case), to make the data flow of
// params more obvious (and make logging easier).
// (Remember: these input functions are just "regular JS functions" -- NOT some
// instance of useSelector or createSelector!)
const mySelectTodos = state => state.todos.entities

const myTestInput = (...params) => {
  // Joe note: every input selector function gets the same params. I'm not
  // sure of the clearest way to put it, but I wouldn't necessarily say that
  // these are the params that we "call createSelector with". (I'd refer to
  // the 1+ input functions and the 1 output function as such.)[1]
  //
  // Rather: createSelector returns[2] a selector function, and it's this
  // *returned* function that we call with the params. (Hopefully that's
  // correct? I believe createSelector is basically curried[3], so.. maybe
  // this is really just a vague explanation of how params work with curried
  // functions?)
  //
  // [1] Nevertheless, for "ease", I might sometimes say "the params we call
  // createSelector with" when I mean the params that typically appear here:
  // useSelector(state => someCreateSelectorFunction(state, these, params)
  // [2] https://redux.js.org/usage/deriving-data-selectors#createselector-overview
  // [3] https://github.com/reduxjs/reselect/issues/253#issuecomment-301572601
  console.log('myTestInput params', params)
}

// function myTestInputCurried(...outerParams) {
//   return function (...innerParams) {
//     console.log('myTestInputCurried outerParams', outerParams)
//     return myTestInput(innerParams)
//   }
// }

const myTestInputCurried = (...outerParams) => (...innerParams) => {
  console.log('myTestInputCurried outerParams', outerParams)
  return myTestInput(innerParams)
}

function myTestInputCurriedES5(...outerParams) {
  return function(...innerParams) {
    console.log('myTestInputCurriedES5 outerParams', outerParams)
    return myTestInput(innerParams)
  }
}

function myTestInputCurriedES52(...outerParams) {
  console.log('myTestInputCurriedES5 outerParams', outerParams)
  return function(...innerParams) {
    return myTestInput(innerParams)
  }
}

export const mySelectFilteredTodoIdsExperiment = createSelector(
  mySelectTodos,
  state => state.filters.status,
  // Supplying "bare reference" to function will call it with all params by
  // default:
  // myTestInput,
  // Or we can pass just one param:
  // state => myTestInput(state),
  // Or a subset of all:
  // (state, someString) => myTestInput(state, someString),
  // Or explicitly pass all. (Note: order can be changed.)
  // (state, someString, someNumber) => myTestInput(someNumber, state, someString),
  // We can use a curried input function if we want to pass it params other
  // than those that we call createSelector with (see [1] above!).
  // Note also that because this function is curried and *only* returns a 
  // function, we actually have to call (that returned function) it here (with
  // or without extra params) -- not just include a reference to it. i.e.,
  // this works (but is pretty pointless!):
  // myTestInputCurried(),
  // and so does this:
  // myTestInputCurried('foo', 'bar'),
  // But this doesn't:
  // myTestInputCurried,
  // Likewise for this ES5 equivalent:
  // myTestInputCurriedES5(),
  // There's also nothing to stop us from doing something silly like this:
  // (state, someString, someNumber) => myTestInputCurriedES5('foo')(state),
  // And of course if the curried function does something other than just
  // return a function, we don't have to call it here to "use" it (but this
  // means the returned function won't be called, so again, it's pretty
  // pointless):
  // myTestInputCurriedES52,
  // Compare what that logs for outerParams compared to what and WHERE this
  // logs:
  // myTestInputCurriedES52('foo', 'bar', 'baz'),
  (todos, status) => {
    if (status === "active") {
      return todos.map(todo => {
        if (todo.completed === false) {
          return todo.id
        }
      }).filter(element => element !== undefined)
    }
    if (status === "completed") {
      return todos.map(todo => {
        if (todo.completed === true) {
          return todo.id
        }
      }).filter(element => element !== undefined)
    }
    return todos.map(todo => todo.id)
  }
)
