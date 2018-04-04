import dispatcher from "../dispatcher";
import AppStore from 'Store';

export function updateVariable(variable) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_VARIABLE,
    variable: variable
  });
}
