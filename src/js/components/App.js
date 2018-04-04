import React from 'react'
import DemoComponent from './DemoComponent'
import io from 'socket.io'

var socket = io();

export default function App(props) {
  return (
    <div>
      <DemoComponent />
    </div>
  )
}
