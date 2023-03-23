import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = (e) => setText(e.target.value)

  // const handleKeyDown = e => {
  const handleKeyDown = async e => {
    // Joe note: this code was copied from the tutorial, but at some point I
    // presume they changed it to use state here (rather than get the target's
    // value), which makes sense. So I'm updating to copy the newer version of
    // their code:
    const trimmedText = text.trim()
    // If the user pressed the Enter key:
    if (e.key === 'Enter' && trimmedText) {
      // Joe note: pre-thunk, now deprecated:
      // Dispatch the "todo added" action with this text
      // dispatch({ type: 'todos/todoAdded', payload: trimmedText })

      
      // Joe note: using thunk instead. The function we export from
      // todosSlice.js expects one param (text), which we pass it here. But
      // it still returns a function which expects two params, which is what
      // calling it (as a param of dispatch()) will achieve, as before.

      // Joe note: this is the tutorial's initial, verbose approach:
      // Create the thunk function with the text the user wrote
      // const saveNewTodoThunk = saveNewTodo(trimmedText)
      // Then dispatch the thunk function itself
      // dispatch(saveNewTodoThunk)

      // Joe note: which it then immediately supercedes with this terser take:
      // dispatch(saveNewTodo(trimmedText))

      // Create and dispatch the thunk function itself
      setStatus('loading')
      // Wait for the promise returned by saveNewTodo
      await dispatch(saveNewTodo(trimmedText))

      // And clear out the text input
      setText('')

      setStatus('idle')
    }
  }

  let isLoading = status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
