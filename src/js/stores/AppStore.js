import { EventEmitter } from 'events'
import params from 'Params'

import dispatcher from '../dispatcher'

class AppStore extends EventEmitter {
  constructor() {
    super()
    this.variable = params.variable;

    this.tag = {
      UPDATE_VARIABLE: 'UPDATE_VARIABLE',
      CHANGE: 'CHANGE'
    }
  }

  getVariable() {
    return this.variable;
  }

  handleActions(action) {
    switch(action.type) {
      case this.tag.UPDATE_VARIABLE: {
        this.variable = action.variable;
        this.emit(this.tag.CHANGE);
        break;
      }
    }
  }

}

const appStore = new AppStore;
dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
