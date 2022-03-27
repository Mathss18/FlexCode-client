import React, { createContext, useContext, useEffect, useState } from "react";
// import { pusher } from "../services/pusher";
import { getFromLS } from "../utils/storage";
import Pusher from 'pusher-js';
import { notification } from "../pages/Chat/ChatNotification";
import userPicture from '../assets/user.jpg';
import api from "../services/api";
import { objectToArray, removeFromArrayByKeyValue } from "../utils/functions";


const PusherContext = createContext();

function PusherContextProvider({ children }) {
  const user = getFromLS('user');
  const [isLogged, setIsLogged] = useState(false);

  const [pusher, setPusher] = useState(undefined);
  const [privateChannel, setPrivateChannel] = useState(undefined);
  const [publicChannel, setPublicChannel] = useState(undefined);

  const [mensagensNaoLidas, setMensagensNaoLidas] = useState([]);
  const [updateMensagensNaoLidas, setUpdateMensagensNaoLidas] = useState(false);

  const [usuariosOnline, setUsuariosOnline] = useState([]);

  const [updateUserStatus, setUpdateUserStatus] = useState(false);

  const [callBack, setCallBack] = useState(() => (data) => notificate(data))

  // Use effect para criar uma instancia do pusher
  useEffect(() => {
    if (localStorage.getItem('token') == null) return;

    if (!pusher) {
      const pusherInstance = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: 'sa1',
        useTLS: true,
        authEndpoint: process.env.REACT_APP_API_URL+'/broadcasting/auth',
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      });

      setPusher(pusherInstance);
    }
    setCallBack(() => (data) => notificate(data));

  }, [isLogged]);

  // Use effect para se inscrever nos canais 
  useEffect(() => {
    if (!pusher) return;

    // Se inscreve no canal privado do usuário logado
    setPrivateChannel(pusher.subscribe('private-chat-' + user?.id));

    // Se inscreve no canal publico 
    setPublicChannel(pusher.subscribe('presence-chat'));

    console.log(pusher);

  }, [pusher])

  // Use effect para se inscrever nos eventos e setar o callback
  useEffect(() => {
    if (!privateChannel || !publicChannel) return;

    privateChannel.unbind("App\\Events\\PrivateMessageSent");
    privateChannel.bind("App\\Events\\PrivateMessageSent", (data) => callBack(data));

    console.log('antes',publicChannel);
    publicChannel.unbind("pusher:subscription_succeeded");
    publicChannel.bind("pusher:subscription_succeeded", (data) => { setarUsuariosOnline(data); console.log('Usuarios Logados:',data);  });
    console.log('depois',publicChannel);
    // console.clear(''); //TODO: remove in production


  }, [privateChannel, publicChannel, callBack])

  // Use effect atualizar se usuarios estão no sistema ou não, em tempo real
  useEffect(() => {
    if (!privateChannel || !publicChannel) return;
      publicChannel.unbind("pusher:member_added");
      publicChannel.bind("pusher:member_added", (member) => { console.log('Adicionado: ', member); usuarioEntrou(member.info); });

      publicChannel.unbind("pusher:member_removed");
      publicChannel.bind("pusher:member_removed", (member) => { console.log('Removido: ', member); usuarioSaiu(member.info); });
  }, [usuariosOnline,updateUserStatus]);

  // Use effect atualizar a lista de mensagens não lidas
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
    if (user['chat-status'] == 'online')
      notification(`${data.message.usuario.nome} diz:`, data.message.message, userPicture); // exibe a notificação de nova mensagem
    setUpdateMensagensNaoLidas((value) => !value); // atualiza o contador de messages nao lidas
  }

  function usuarioEntrou(usuario) {
    let aux = [...usuariosOnline, usuario]
    setUsuariosOnline(aux);
    console.log('Usuario Entrou, então todos os usuarios online', aux)
  }

  function usuarioSaiu(usuario) {
    let aux = removeFromArrayByKeyValue(usuariosOnline, 'id', usuario.id);
    setUsuariosOnline(aux);
    console.log('Usuario Saiu, então todos os usuarios online', aux)
  }

  function setarUsuariosOnline(data){
    setUsuariosOnline(objectToArray(data.members));
  }



  return (
    <PusherContext.Provider
      value={
        {
          useIsLogged: { isLogged, setIsLogged },
          useCallBack: { callBack, setCallBack },
          useMensagensNaoLidas: { mensagensNaoLidas, setMensagensNaoLidas },
          useUpdateMensagensNaoLidas: { updateMensagensNaoLidas, setUpdateMensagensNaoLidas },
          useUsuariosOnline: { usuariosOnline, setUsuariosOnline },
          useUpdateUserStatus: { updateUserStatus, setUpdateUserStatus },
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
