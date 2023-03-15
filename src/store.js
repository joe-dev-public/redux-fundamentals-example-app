import { applyMiddleware, compose, createStore } from "redux"
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from "./reducer"

// Joe note: enhancers:
import { sayHiOnDispatch, includeMeaningOfLife } from './exampleAddons/enhancers'

// Joe note: middleware:
import { print1, print2, print3, loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware } from './exampleAddons/middleware'

// let preloadedState
// const persistedTodosString = localStorage.getItem('todos')

// if (persistedTodosString) {
//   preloadedState = {
//     todos: JSON.parse(persistedTodosString)
//   }
// }

// const store = createStore(rootReducer, preloadedState)

// Joe note: regular store:
// const store = createStore(rootReducer)

// Joe note: enhanced store, one enhancer only/"uncomposed":
// const store = createStore(rootReducer, undefined, sayHiOnDispatch)

// Joe note: store with composed enhancer ("many enhancers in one"):
// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)
// const store = createStore(rootReducer, undefined, composedEnhancer)

// Joe note: store with middleware:
// const middlewareEnhancer = applyMiddleware(print1, print2, print3)
// const middlewareEnhancer = applyMiddleware(print1, print2, print3, loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware)
// const store = createStore(rootReducer, middlewareEnhancer)

// Joe note: store with DevTools composed enhancers:
// const composedEnhancer = composeWithDevTools(
//   // EXAMPLE: Add whatever middleware you actually want to use here
//   // applyMiddleware(print1, print2, print3)
//   applyMiddleware(print1, print2, print3, loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware)
//   // other store enhancers if any
// )

// Joe test: the tutorial didn't cover using middleware and enhancers at the
// same time. Wanting to do this might be unlikely(/undesirable for reasons I
// can't think of). But the tutorial's comments above suggest it should be easy
// to achieve when using composeWithDevTools. And indeed this seems to work:
// const composedEnhancer = composeWithDevTools(
//   applyMiddleware(print1, loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware),
//   sayHiOnDispatch,
//   includeMeaningOfLife
// )

// Joe test: finally, can we do this without DevTools? Yes, it seems so!
// const composedEnhancer = compose(
//   applyMiddleware(print1, loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware),
//   sayHiOnDispatch,
//   includeMeaningOfLife
// )

// Joe note: I'm going to leave this like this for now:
const composedEnhancer = composeWithDevTools(
  applyMiddleware(loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware)
)

// Joe note: 2nd param (preloadedState) is optional and can be omitted:
const store = createStore(rootReducer, composedEnhancer)

export default store
