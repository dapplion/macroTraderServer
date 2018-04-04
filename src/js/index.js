import React from 'react'
import { render } from 'react-dom'
import App from './components/App';

import '../css/main.scss';

function Layout(props) {
  return (
    <App />
  )
}

render(<Layout />, document.getElementById('root'));
