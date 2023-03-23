import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
import { colorFilterChanged, StatusFilters } from '../filters/filtersSlice'

import { selectTodos } from '../todos/todosSlice'

const RemainingTodos = ({ count }) => {
  const suffix = count === 1 ? '' : 's'

  return (
    <div className="todo-count">
      <h5>Remaining Todos</h5>
      <strong>{count}</strong> item{suffix} left
    </div>
  )
}

const StatusFilter = ({ value: status, onChange }) => {
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key]
    const handleClick = () => onChange(value)
    const className = value === status ? 'selected' : ''

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    )
  })

  return (
    <div className="filters statusFilters">
      <h5>Filter by Status</h5>
      <ul>{renderedFilters}</ul>
    </div>
  )
}

const ColorFilters = ({ value: colors, onChange }) => {
  const renderedColors = availableColors.map((color) => {
    const checked = colors.includes(color)
    const handleChange = () => {
      const changeType = checked ? 'removed' : 'added'
      onChange(color, changeType)
    }

    return (
      <label key={color}>
        <input
          type="checkbox"
          name={color}
          checked={checked}
          onChange={handleChange}
        />
        <span
          className="color-block"
          style={{
            backgroundColor: color,
          }}
        ></span>
        {capitalize(color)}
      </label>
    )
  })

  return (
    <div className="filters colorFilters">
      <h5>Filter by Color</h5>
      <form className="colorSelection">{renderedColors}</form>
    </div>
  )
}

const Footer = () => {
  const dispatch = useDispatch()

  // const colors = []
  // const status = StatusFilters.All
  // const todosRemaining = 1

  const todosRemaining = useSelector(state => {
    // Joe note: the tutorial didn't explicitly mention that this needed
    // updating for the async request status stuff, but it does. More
    // worrying is the fact that without updating this, the page "fails
    // silently" -- it just renders nothing, and there are no useful errors
    // or warnings in the console. This seems to be characteristic of Redux?
    const uncompletedTodos = selectTodos(state).filter(todo => !todo.completed)
    return uncompletedTodos.length
  })

  const { status, colors } = useSelector(state => state.filters)

  const onColorChange = (color, changeType) => {
    // console.log('Color change: ', { color, changeType })
    dispatch(colorFilterChanged(color, changeType))
  }

  const onStatusChange = (status) => {
    // console.log('Status change: ', status)
    dispatch({ type: 'filters/statusFilterChanged', payload: status })
  }

  const handleMarkAllCompleted = () => {
    dispatch({ type: 'todos/allCompleted' })
  }

  const handleClearCompleted = () => {
    dispatch({ type: 'todos/completedCleared' })
  }

  // Joe note: "async function middleware" example. (I've changed the
  // tutorial example a fair bit.) What's key: this function has "dispatch"
  // and "getState" as arguments. (It doesn't do anything useful with latter.)
  const someAsyncFunction = (dispatch, getState) => {
    return setTimeout(() => {
      dispatch({ type: 'todos/allCompleted' })
      console.log(
        'getState after dispatch',
        getState().todos.map(({completed}) => completed)
      )
    }, 1500)
  }
  // Joe note: clarifying basic JS stuff: the function definition above
  // takes two params. They're "filled in" when this function is ultimately
  // called in middleware.js (with Redux's built-in store API methods).

  const handleAsyncAllComplete = () => {
    // Joe note: the crux: passing a FUNCTION (of all things!) to dispatch.
    dispatch(someAsyncFunction)

    // Joe note: just to clarify some basic JS stuff that I still(!) confuse
    // myself about: here we are calling "dispatch" and giving it one param,
    // which is the function someAsyncFunction. (Or possibly, technically, a/
    // the reference to this function. Still haven't fully clarified refs etc.
    // but that's OK for now.) Importantly: we are *not* calling someAsyncFn
    // here.
  }

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button" onClick={handleMarkAllCompleted}>Mark All Completed</button>
        <button className="button" onClick={handleClearCompleted}>Clear Completed</button>
        <button className="button" onClick={handleAsyncAllComplete}>Async all complete</button>
      </div>

      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}

export default Footer
