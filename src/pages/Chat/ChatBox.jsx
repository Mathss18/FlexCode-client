import { Grid, TextField, Tooltip } from '@material-ui/core';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getFromLS } from '../../utils/storage';
import userPicture from '../../assets/user.jpg';
import { notification } from './ChatNotification';
import { usePusherContext } from '../../context/PusherContext';



function ChatBox() {

  const user = getFromLS('user');
  const pusherContext = usePusherContext();
  const [messages, setMessages] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtivo, setUsuarioAtivo] = useState();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!usuarioAtivo)
      return;

    pusherContext.useCallBack.setCallBack(() => (data) => addMessageToChat(data)) // se estamos no chat com um usuario ativo selecionado

    return () => {
      pusherContext.useCallBack.setCallBack(() => (data) => notificate(data)) // se saimos do chat, voltamos ao estado inicial (mesmo que do PusherContext)
    }

  }, [usuarioAtivo]);

  useEffect(() => {
    api.get('/usuarios')
      .then((response) => {
        setUsuarios(response.data['data'])
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
    console.log('User Ativo Name:', usuarioAtivo)
    console.log('Mensagem Recebida:', data.message);

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
    if(user['chat-status'] == 'online')
      notification(`${data.message.usuario.nome} diz`, data.message.message, userPicture); // exibe a notificação de nova mensagem
    pusherContext.useUpdateMensagensNaoLidas.setUpdateMensagensNaoLidas((value) => !value); // atualiza o contador de messages nao lidas
  }


  return (
    <div>
      <div className="chat-box">
        <div className="chat-box-header">
          <h1>Caixa de entrada - {user.nome}</h1>
        </div>
        <div className="chat-box-body">

          <div className="chat-usuarios">

            {usuarios.map((item) => {
              return <button key={item.id} onClick={() => { trocarUsuarioAtivo(item) }}>{item.nome}</button>
            })}

          </div>

          <div className="chat-messages">
            <ul>
              {messages.map((item) => {
                if (true) {
                  return <li key={item.id}>{item.message} - {item.usuario.nome}</li>
                }

              })}
            </ul>
          </div>

        </div>
        <div className="chat-box-footer">
          <div>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Digite sua mensagem"
                value={message}
                name="message"
                InputProps={{
                  endAdornment:
                    <Tooltip
                      title="Enviar"
                      onClick={handleSendMessage}
                    >
                      <SendIcon />
                    </Tooltip>
                }}
                onChange={handleMessageChange}
              />
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;