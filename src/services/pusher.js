import Pusher from 'pusher-js';

Pusher.logToConsole = false;

console.log(localStorage.getItem('token'));

export const pusher = new Pusher('b207cbd9ce6316eeb648', {
  cluster: 'sa1',
  useTLS: true,
  authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
});
