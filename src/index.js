/*
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import './api/server'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
*/

// Omit existing React imports
// Omit existing React rendering logic

import store from './store'

// Log the initial state
console.log('Initial state: ', store.getState())
// {todos: [....], filters: {status, colors}}

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() =>
  console.log('State after dispatch: ', store.getState())
)

// Now, dispatch some actions

store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' })

store.dispatch({ type: 'todos/todoToggled', payload: 0 })
store.dispatch({ type: 'todos/todoToggled', payload: 1 })


// Joe test: what happens if we log one?
const myDispatch = store.dispatch({ type: 'todos/todoToggled', payload: 0 })
// Joe note: seems to log the action, so I guess .dispatch returns the action?
console.log('myDispatch', myDispatch)
// Joe note: for the "always return hello" custom middleware test, this will
// (as the tutorial says) log "Hello!", NOT the action. So middleware can
// change what .dispatch returns. (Although I'm aware of the various use
// cases of middleware, and can vaguely sense why being able to change actions
// between their dispatch and the reducer is very powerful, I don't know Redux
// well enough yet to have an intuitive sense for *how* to use this.)


store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' })

store.dispatch({
  type: 'filters/colorFilterChanged',
  payload: { color: 'red', changeType: 'added' }
})

// Stop listening to state updates
unsubscribe()

// Dispatch one more action to see what happens
// Joe note: nothing will log, unless you have the sayHi enhancer enabled,
// in which case this will log "Hi!".
// When you have DevTools though, you'll be able to see this dispatch there.
store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' })
