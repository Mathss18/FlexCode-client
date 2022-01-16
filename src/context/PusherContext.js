import React, { createContext, useContext, useEffect, useState } from "react";
// import { pusher } from "../services/pusher";
import { getFromLS } from "../utils/storage";
import Pusher from 'pusher-js';
import { notification } from "../pages/Chat/ChatNotification";
import userPicture from '../assets/user.jpg';
import api from "../services/api";


const PusherContext = createContext();

function PusherContextProvider({ children }) {
  const user = getFromLS('user');
  const [privateChannel, setPrivateChannel] = useState(undefined);
  const [publicChannel, setPublicChannel] = useState(undefined);
  const [isLogged, setIsLogged] = useState(false);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState([]);
  const [updateMensagensNaoLidas, setUpdateMensagensNaoLidas] = useState(false);
  const [callBack, setCallBack] = useState(() => (data) => notificate(data))

  useEffect(() => {
    if (localStorage.getItem('token') == null) return;

    const pusher = new Pusher('b207cbd9ce6316eeb648', {
      cluster: 'sa1',
      useTLS: true,
      authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    });


    if (privateChannel) {
      console.log('Depois');
      //pusher.subscribe('private-chat-' + user?.id) // Se inscreve no canal privado do usuário logado - tivemos que criar isso pois de na primeira vez que entramos no useEffect o privateChannel não estava definido
      //pusher.subscribe('presence-chat') // Se inscreve no canal privado do usuário logado - tivemos que criar isso pois de na primeira vez que entramos no useEffect o privateChannel não estava definido
      privateChannel.unbind("App\\Events\\PrivateMessageSent");
      privateChannel.bind("App\\Events\\PrivateMessageSent", (data) => callBack(data));

      //pusher.subscribe('presence-chat') // Se inscreve no canal publico 
      publicChannel.unbind("pusher:subscription_succeeded");
      publicChannel.bind("pusher:subscription_succeeded", (data) => { console.log(data) });

      publicChannel.unbind("pusher:member_added");
      publicChannel.bind("pusher:member_added", (member) => { console.log('Adicionado: ', member); });

      publicChannel.unbind("pusher:member_removed");
      publicChannel.bind("pusher:member_removed", (member) => { console.log('Removido: ', member); });

      setPrivateChannel(privateChannel);
      setPublicChannel(publicChannel);
    }
    else {
      console.log('Primeiro');

      const privatePusherChannel = pusher.subscribe('private-chat-' + user?.id) // Se inscreve no canal privado do usuário logado - tivemos que criar isso pois de na primeira vez que entramos no useEffect o channel não estava definido
      privatePusherChannel.unbind("App\\Events\\PrivateMessageSent");
      privatePusherChannel.bind("App\\Events\\PrivateMessageSent", (data) => callBack(data));

      const publicPusherChannel = pusher.subscribe('presence-chat') // Se inscreve no canal publico 
      publicPusherChannel.unbind("pusher:subscription_succeeded");
      publicPusherChannel.bind("pusher:subscription_succeeded", (data) => { console.log(data) });

      publicPusherChannel.unbind("pusher:member_added");
      publicPusherChannel.bind("pusher:member_added", (member) => { console.log('Adicionado: ', member); });

      publicPusherChannel.unbind("pusher:member_removed");
      publicPusherChannel.bind("pusher:member_removed", (member) => { console.log('Removido: ', member); });



      setPrivateChannel(privatePusherChannel);
      setPublicChannel(publicPusherChannel);


    }

  }, [isLogged, callBack]);

  useEffect(() => {
    if (localStorage.getItem('token') == null) return;

    api.get('/mensagens-nao-lidas')
      .then(response => {
        setMensagensNaoLidas(response.data['data']);
      })
      .catch(error => {
        console.log(error);
      })

  }, [updateMensagensNaoLidas, isLogged])

  function notificate(data) {
    if(user['chat-status'] == 'online')
      notification(`${data.message.usuario.nome} diz`, data.message.message, userPicture); // exibe a notificação de nova mensagem
    setUpdateMensagensNaoLidas((value) => !value); // atualiza o contador de messages nao lidas
  }

  return (
    <PusherContext.Provider
      value={
        {
          useIsLogged: { isLogged, setIsLogged },
          useCallBack: { callBack, setCallBack },
          useMensagensNaoLidas: { mensagensNaoLidas, setMensagensNaoLidas },
          useUpdateMensagensNaoLidas: { updateMensagensNaoLidas, setUpdateMensagensNaoLidas }
        }
      }>
      {children}
    </PusherContext.Provider>
  );
};


export function usePusherContext() {
  return useContext(PusherContext);
}

export default PusherContextProvider;
