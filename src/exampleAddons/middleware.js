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

// Joe note: example async middleware with function "in place" (similar to
// above). Note this only delays adding a todo item.
export const delayedActionMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      // Delay this action by one second
      next(action)
    }, 1000)
    return
  }

  return next(action)
}

// Joe note: "async function middleware", as an "improvement" on the above
// (because it lets us write async logic separately from/in advance of the
// middleware specifics?).
// export const asyncFunctionMiddleware = storeAPI => next => action => {
//   // If the "action" is actually a function instead...
//   if (typeof action === 'function') {
//     // then call the function and pass `dispatch` and `getState` as arguments
//     return action(storeAPI.dispatch, storeAPI.getState)
//   }

//   // Otherwise, it's a normal action - send it onwards
//   return next(action)
// }

// Joe note: rewriting above in verbose (ES5) functions, using
// conventional middleware function names:
export function asyncFunctionMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      if (typeof action === 'function') {
        // Joe note: naturally, the parameter variables from all "ancestor"
        // (enclosing) scopes are available here:
        return action(storeAPI.dispatch, storeAPI.getState)
        // Joe note: just clarifying some basic JS stuff, in case it's not
        // abundantly clear already. "action" is a parameter (part of the
        // built-in-to-Redux pattern of how middleware is written) which
        // contains the.. wait for it.. action that was dispatched.
        // In this case, we're dispatching a function, so of course we can
        // *call* it. And that's what happens here: this is where we actually
        // call the function. The function, as defined in Footer.js, takes
        // two params, and those get passed in here. (The params happen to come
        // from an "enclosing" scope; they're two of Redux's built-in store
        // API methods.) https://redux.js.org/api/store#store-methods-1
        // Importantly: while it can be said we call the function here, the
        // *result* of that call is what this innermost function (handleAction)
        // actually *returns*.
        // Admittedly, for the moment, I'm not entirely sure of the
        // implications of *returning* from middleware like this, except in the
        // obvious case of "return next(action)" below. I've probably just
        // forgotten/need to build up my intuition about it/see some better
        // real-world examples of how middleware can be used. (Consider:
        // https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware)
      }
      return next(action)
    }
  }
}
