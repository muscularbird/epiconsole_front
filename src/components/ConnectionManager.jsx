import React from 'react';
import { socket } from '../socket';

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={ connect } className='mr-4 bg-amber-900 rounded-xl p-1 hover:cursor-grab'>Connect</button>
      <button onClick={ disconnect } className='mr-4 bg-amber-900 rounded-xl p-1 hover:cursor-grab'>Disconnect</button>
    </>
  );
}