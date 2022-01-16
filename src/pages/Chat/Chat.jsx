import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { usePusherContext } from '../../context/PusherContext';
import { Grid, TextField, Paper, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Typography } from '@material-ui/core';
import api from '../../services/api';
import { getFromLS } from '../../utils/storage';
import { notification } from './ChatNotification';
import userPicture from '../../assets/user.jpg';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import './chat.css';


function Chat() {
  const user = getFromLS('user');
  const pusherContext = usePusherContext();
  const [messages, setMessages] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtivo, setUsuarioAtivo] = useState();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!usuarioAtivo)
      return;

    pusherContext.useCallBack.setCallBack(() => (data) => addMessageToChat(data)) // se estamos no chat com um usuario ativo selecionado

    return () => {
      pusherContext.useCallBack.setCallBack(() => (data) => notificate(data)) // se saimos do chat, voltamos ao estado inicial (mesmo que do PusherContext)
    }

  }, [usuarioAtivo]);

  useEffect(() => {
    const counts = {};

    api.get('/usuarios')
      .then((response) => {
        
        // Conta quantas mensagens não lida têm cada usuario e coloca em um objeto: {id_usuario: quantidade}
        pusherContext.useMensagensNaoLidas.mensagensNaoLidas.forEach((el) => {
          counts[el.usuario_id] = counts[el.usuario_id] ? (counts[el.usuario_id] += 1) : 1;
        });

        // Percorre o array de usuarios e adiciona o objeto counts ao usuario
        response.data['data'].map((el) => {
          el.qtdeMensagensNaoLidas = counts[el.id] ? counts[el.id] : 0;
        })

        // Seta o array de usuarios com a qtdeMensagensNaoLidas
        setUsuarios(response.data['data'])
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pusherContext.useMensagensNaoLidas.mensagensNaoLidas]);

  useEffect(() => {
    scrollToBottom()
  }, [messages, usuarioAtivo]);


  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  function handleSendMessage(event) {
    let conteudo = {
      message: message,
      usuario_receptor_id: usuarioAtivo?.id,
    }

    api.post('/mensagem-privada', conteudo)
      .then((response) => {
        response.data['data'].usuario = user;
        setMessage('');

        // verifica se o usuario que mandou a msg não é o mesmo do usuario ativo (no caso da pessoa estar conversando com ela mesma)
        if (response.data['data'].usuario.id != usuarioAtivo?.id)
          setMessages(oldArray => [...oldArray, response.data['data']]);

      })
      .catch((error) => {
        console.log(error);
      });
  }

  function addMessageToChat(data) {
    if (usuarioAtivo.id == data.message.usuario_id) {
      data.message.usuario = usuarioAtivo;
      setMessages(oldArray => [...oldArray, data.message]);
    }
    else {
      notificate(data);
    }
  }

  function trocarUsuarioAtivo(usuario) {
    setUsuarioAtivo(usuario);
    fetchPrivateMessages(usuario)
    pusherContext.useUpdateMensagensNaoLidas.setUpdateMensagensNaoLidas((value) => !value); // atualiza o contador de messages nao lidas
  }

  function fetchPrivateMessages(usuario) {
    api.get('/mensagens-privadas/' + usuario?.id)
      .then((response) => {
        setMessages(response.data['data'])
      })
      .catch((error) => {
        console.log(error);
      });

    api.put('/ler-mensagens', { usuario_id: usuario?.id })
      .then((response) => {
        console.log('Qtde de messages lidas', response.data['data']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function notificate(data) {
    if (user['chat-status'] == 'online')
      notification(`${data.message.usuario.nome} diz`, data.message.message, userPicture); // exibe a notificação de nova mensagem
    pusherContext.useUpdateMensagensNaoLidas.setUpdateMensagensNaoLidas((value) => !value); // atualiza o contador de messages nao lidas
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12} >
          <Typography variant="h5" className="header-message">Chat</Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={'chat-box-container'}>
        <Grid item xs={3} className={'chat-box-contacts'}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <Avatar alt={user.nome} src={userPicture} />
              </ListItemIcon>
              <Typography variant="h5" component="h5" className={'contact-name'}>{user.nome}</Typography>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '10px' }}>
            <TextField label="Pesquisar por contato" variant="outlined" fullWidth />
          </Grid>
          <Divider />
          <List className={'chat-box-contacts-container'}>

            {usuarios.map((item) => {
              if (usuarioAtivo && usuarioAtivo.id == item.id)
                item.ativo = true;
              else
                item.ativo = false;

              return (
                <ListItem onClick={() => { trocarUsuarioAtivo(item) }} className={item.ativo ? 'active-contact' : ''} key={item.id} button>
                  <ListItemIcon>
                    <Avatar alt="User" src="https://bootdey.com/img/Content/avatar/avatar6.png" />
                  </ListItemIcon>
                  <Typography variant="h5" component="h5" className={'contact-name'}>{item.nome}</Typography>
                  <Typography variant="caption" className={'contact-subtitle'}>{item.qtdeMensagensNaoLidas > 0 ? `${item.qtdeMensagensNaoLidas} novas mensagens` : ''} </Typography>
                  <div className={['user-status', item['chat-status']].join(" ")} style={{ marginLeft: 'auto' }}><p>⠀</p></div>
                </ListItem>
              );
            })}

          </List>
        </Grid>
        <Grid item xs={9} >
          <List className={'chat-box-background'}>

            {messages.map((item) => {
              //Se o id do usuario que enviou a mensagem for difernte do id do usuario logado, exibe a mensagem na esquerda
              if (item.usuario_id != user.id)
                item.possicao = 'left';
              else
                item.possicao = 'right';
              return (
                <ListItem className={`message-balloon-${item.possicao}`} key={item.id} align={item.possicao}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText className={'message-text'} style={{ wordBreak: 'break-all', width: 'fit-content' }} align={item.possicao} primary={item.message}></ListItemText>
                    </Grid>
                    <Grid item xs={12} className={`message-subtitle-${item.possicao}`}>
                      <Typography variant="caption" align={item.possicao}>{moment(item.created_at).format("DD/MM HH:mm")}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
            <div ref={messagesEndRef} />


          </List>

          <Grid container className={'text-box-background'}>
            <Grid item xs={11}>
              <TextField onChange={handleMessageChange} id="text-field" value={message} placeholder="Digite aqui" fullWidth />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab onClick={handleSendMessage} color="primary" aria-label="add" ><SendIcon /></Fab>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </div>
  );
}

export default Chat;