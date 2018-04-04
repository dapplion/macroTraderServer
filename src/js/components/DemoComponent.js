import React from 'react'
import AppStore from 'Store'
// import './API/BittrexCalls'


const credentials = {
  Key: "4c294b8570334ff0802aa4b5ecf7de52",
  Secret: "19979712c8374a9f87587e78ede83635"
}

let testUrl = 'https://bittrex.com/api/v1.1/public/getmarkets';

export default class DemoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variable: AppStore.getVariable()
    }
  }

  componentWillMount() {
    AppStore.on("CHANGE", this.getVariable.bind(this));
  }
  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.getVariable.bind(this));
  }
  getVariable() {
    this.setState({
      variable: AppStore.getVariable()
    });
  }
  getBalances() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", testUrl, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
  }

  render() {
    let variableString = JSON.stringify(this.state.variable);
    return (
      <div>
        <span>Get Balances: </span>
        <button onClick={this.getBalances.bind(this)}>Click me</button>
        <span><strong>{variableString}</strong></span>
      </div>
    );
  }
}
