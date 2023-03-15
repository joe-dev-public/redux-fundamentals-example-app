export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1')
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}

// Joe note: custom middleware from tutorial:
// export const loggerMiddleware = storeAPI => next => action => {
//   console.log('dispatching', action)
//   let result = next(action)
//   console.log('next state', storeAPI.getState())
//   return result
// }

// Joe note: rewriting above in verbose (ES5) functions, using
// conventional middleware function names:
export function loggerMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      console.log('dispatching', action)
      // Joe note: this won't return until "the reducers run and the state is
      // updated"? 🤔
      // https://redux.js.org/tutorials/fundamentals/part-4-store#your-first-custom-middleware
      let result = next(action)
      console.log('next state', storeAPI.getState())
      return result
    }
  }
}

export const alwaysReturnHelloMiddleware = storeAPI => next => action => {
  // console.log("Always return hello")
  const originalResult = next(action)
  // Ignore the original result, return something else
  return 'Hello!'
}

// Joe note: async custom middleware
export const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload)
    }, 1000)
  }

  return next(action)
}
