import { connectRoutes } from "redux-first-router";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import createHistory from "history/createHashHistory";

import { routeMap } from "../actions/routes";
import reducerMap from "../reducers";
import rootSaga from "../sagas";

export const history = createHistory();

export const configureStore = preloadedState => {
  const {
    reducer: location,
    middleware: routerMiddleware,
    enhancer,
    initialDispatch,
  } = connectRoutes(history, routeMap, {
    initialDispatch: false,
  });

  const sagaMiddleware = createSagaMiddleware();

  const middlewares = applyMiddleware(routerMiddleware, sagaMiddleware);

  /* eslint-disable no-underscore-dangle */
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;
  /* eslint-enable */

  const enhanced = compose(enhancer, middlewares, devTools);

  const store = createStore(
    combineReducers({ ...reducerMap, location }),
    preloadedState,
    enhanced,
  );

  sagaMiddleware.run(rootSaga);
  initialDispatch();

  return store;
};

export default configureStore;
