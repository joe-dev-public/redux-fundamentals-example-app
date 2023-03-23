import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import { mySelectFilteredTodoIdsExperiment, selectFilteredTodoIds, selectTodoIds } from './todosSlice'
import TodoListItem from './TodoListItem'

// const selectTodos = state => state.todos

// const selectTodoIds = state => state.todos.map(todo => todo.id)

const TodoList = () => {
  // const todos = useSelector(selectTodos)

  // const todoIds = useSelector(selectTodoIds)
  // const todoIds = useSelector(selectTodoIds, shallowEqual)
  const todoIds = useSelector(selectFilteredTodoIds)


  // Joe note: for experimenting with createSelector, keep in mind that this:
  // const todoIds = useSelector(mySelectFilteredTodoIdsExperiment)
  // is equivalent to:
  // const todoIds = useSelector(state => mySelectFilteredTodoIdsExperiment(state))
  // which means you can pass other params to your createSelector function:
  // const todoIds = useSelector(
  //   state => mySelectFilteredTodoIdsExperiment(state, 'test', 42)
  // )
  // You can ofc write that arrow func with explicit returns, too:
  // const todoIds = useSelector(
  //   (state) => {
  //     return mySelectFilteredTodoIdsExperiment(state, 'test', 42)
  //   }
  // )

  // And just to really drive the point home, here's the createSelector
  // written "in-line" with the useSelector, with the params being immediately
  // passed to **the selector function that createSelector returns**, via the
  // second set of parenthesis. (myTestInput2 added for helpful logging.)
  const myTestInput2 = (...params) => {
    console.log('myTestInput2 params', params)
  }

  // const todoIds = useSelector(
  //   state => createSelector(
  //     state => state.todos,
  //     state => state.filters.status,
  //     myTestInput2,
  //     (todos, status) => {
  //       if (status === "active") {
  //         return todos.map(todo => {
  //           if (todo.completed === false) {
  //             return todo.id
  //           }
  //         }).filter(element => element !== undefined)
  //       }
  //       if (status === "completed") {
  //         return todos.map(todo => {
  //           if (todo.completed === true) {
  //             return todo.id
  //           }
  //         }).filter(element => element !== undefined)
  //       }
  //       return todos.map(todo => todo.id)
  //     }
  //   )(state, 'test', 42)
  // )

  // Note that useSelector only has one param, "state". (As the react-redux
  // docs say: "The selector will be called with the entire Redux store state
  // as its **only argument**." [emphasis mine]
  // source: https://react-redux.js.org/api/hooks#useselector
  // If you try to use "another" (non-existent) param, it'll just be undefined:
  // const todoIds = useSelector((state, something) => mySelectFilteredTodoIdsExperiment(state, something))


  const loadingStatus = useSelector(state => state.todos.status)

  console.log('loadingStatus', loadingStatus)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

    // since `todos` is an array, we can loop over it
  // const renderedListItems = todos.map(todo => {
  const renderedListItems = todoIds.map(todoId => {
    return <TodoListItem key={todoId} id={todoId} />
    // return <TodoListItem key={todo.id} todo={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList