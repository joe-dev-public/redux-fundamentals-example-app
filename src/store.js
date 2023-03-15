import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "./reducer";

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
// const middlewareEnhancer = applyMiddleware(print1, print2, print3, loggerMiddleware)
const middlewareEnhancer = applyMiddleware(print1, print2, print3, loggerMiddleware, alwaysReturnHelloMiddleware, delayedMessageMiddleware)
const store = createStore(rootReducer, middlewareEnhancer)

export default store
