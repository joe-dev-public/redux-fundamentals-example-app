import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { availableColors, capitalize } from '../filters/colors'

const selectTodoById = (state, todoId) => {
  return state.todos.find(todo => todo.id === todoId)
}

// const TodoListItem = ({ todo, onColorChange, onCompletedChange, onDelete }) => {
// Destructure `props.id`, since we only need the ID value
const TodoListItem = ({ id }) => {

  // Call our `selectTodoById` with the state _and_ the ID value
  const todo = useSelector(state => selectTodoById(state, id))

  const { text, completed, color } = todo

  const dispatch = useDispatch()

  const handleCompletedChanged = () => {
    dispatch({ type: 'todos/todoToggled', payload: todo.id })
  }

  // const handleCompletedChanged = (e) => {
  //   onCompletedChange(e.target.checked)
  // }

  const handleColorChanged = (e) => {
    // onColorChange(e.target.value)
    // console.log("handleColorchange", e.target.value)
    dispatch({ type: 'todos/colorSelected', payload: { todoId: todo.id, color: e.target.value }})
  }

  const onDelete = () => {
    console.log("onDelete")
  }

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
