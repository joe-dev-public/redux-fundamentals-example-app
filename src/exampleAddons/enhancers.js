export const sayHiOnDispatch = (createStore) => {
  return (rootReducer, preloadedState, enhancers) => {
    const store = createStore(rootReducer, preloadedState, enhancers)

    function newDispatch(action) {
      // Joe note: call the *original*, then just log "Hi!"
      const result = store.dispatch(action)
      console.log('Hi!')
      return result
    }

    // Joe note: everything as original/passed in, except the new dispatch
    // function (which includes the original).
    return { ...store, dispatch: newDispatch }
  }
}

export const includeMeaningOfLife = (createStore) => {
  return (rootReducer, preloadedState, enhancers) => {
    const store = createStore(rootReducer, preloadedState, enhancers)

    function newGetState() {
      return {
        // Joe note: return store as it is, but with one property added:
        ...store.getState(),
        meaningOfLife: 42,
      }
    }

    return { ...store, getState: newGetState }
  }
}
