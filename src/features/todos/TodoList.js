import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

// const selectTodos = state => state.todos

const selectTodoIds = state => state.todos.map(todo => todo.id)

const TodoList = () => {
  // const todos = useSelector(selectTodos)

  // const todoIds = useSelector(selectTodoIds)
  const todoIds = useSelector(selectTodoIds, shallowEqual)

  // since `todos` is an array, we can loop over it
  // const renderedListItems = todos.map(todo => {
  const renderedListItems = todoIds.map(todoId => {
    return <TodoListItem key={todoId} id={todoId} />
    // return <TodoListItem key={todo.id} todo={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList