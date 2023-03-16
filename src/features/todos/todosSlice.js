import { client } from '../../api/client'

const initialState = []

// Joe note: tutorial's placeholder data/default todos state:
// const initialState = [
//   { id: 0, text: 'Learn React', completed: true },
//   { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
//   { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
// ]

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export default function todosReducer(state = initialState, action) {

  switch (action.type) {

    // {type: 'todos/todoAdded', payload: todoText}
    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return [
        ...state,
        {
          id: nextTodoId(state),
          text: action.payload,
          completed: false
        }
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

// Thunk function
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)

  dispatch({ type: 'todos/todosLoaded', payload: response.todos })

  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.length)
}
