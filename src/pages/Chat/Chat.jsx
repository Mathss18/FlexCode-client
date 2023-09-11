import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { usePusherContext } from "../../context/PusherContext";
import {
  Grid,
  TextField,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fab,
  Typography,
} from "@material-ui/core";
import api from "../../services/api";
import { getFromLS } from "../../utils/storage";
import { notification } from "./ChatNotification";
import userPicture from "../../assets/user.jpg";
import SendIcon from "@material-ui/icons/Send";
import moment from "moment";
import "./chat.css";
import { moveObjectInArray } from "../../utils/functions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { emojiConfig } from "../../config/emojiConfig";
import toast from "react-hot-toast";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useFocus } from "../../hooks/useFocus";

function Chat() {
  const user = getFromLS("user");
  const pusherContext = usePusherContext();
  const [messages, setMessages] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtivo, setUsuarioAtivo] = useState();
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const [inputRef, setInputFocus] = useFocus();
  const foto = localStorage.getItem("foto");

  useEffect(() => {
    if (!usuarioAtivo) return;

    pusherContext.useCallBack.setCallBack(
      () => (data) => addMessageToChat(data)
    ); // se estamos no chat com um usuario ativo selecionado

    return () => {
      pusherContext.useCallBack.setCallBack(() => (data) => notificate(data)); // se saimos do chat, voltamos ao estado inicial (mesmo que do PusherContext)
    };
  }, [usuarioAtivo]);

  useEffect(() => {
    const counts = {};

    api
      .get("/usuarios")
      .then((response) => {
        // Pega apenas usuarios ativos
        const activeUsers = response.data["data"].filter(item => item.situacao);

        let userIndex = activeUsers.findIndex(
          (item) => user.id === item.id
        );
        console.log(userIndex);

        // Conta quantas mensagens não lida têm cada usuario e coloca em um objeto: {id_usuario: quantidade}
        pusherContext.useMensagensNaoLidas.mensagensNaoLidas.forEach((el) => {
          counts[el.usuario_id] = counts[el.usuario_id]
            ? (counts[el.usuario_id] += 1)
            : 1;
        });

        // Percorre o array de usuarios e adiciona o objeto counts ao usuario
        activeUsers.map((el) => {
          el.qtdeMensagensNaoLidas = counts[el.id] ? counts[el.id] : 0;
        });       

        // Seta o array de usuarios colocando o usuario logado no inicio
        setUsuarios(moveObjectInArray(activeUsers, userIndex, 0));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    pusherContext.useMensagensNaoLidas.mensagensNaoLidas,
    pusherContext.useUpdateUserStatus.updateUserStatus,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, usuarioAtivo]);

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  function handleSendMessage(event) {
    event.preventDefault();
    if (message.trim() === "") return;
    let conteudo = {
      message: message,
      usuario_receptor_id: usuarioAtivo?.id,
    };

    // criar essa fakeMessage que basicamente é usada para colocar no chat a messagem do usario imediatamente
    let fakeMessage = {
      message: message,
      usuario_receptor_id: usuarioAtivo?.id,
      usuario_id: user.id,
      vizualizado: true, //todo: mudar essa propriedade pq nem sempre a msg vai ser enviada já vizualizada
      updated_at: Date(),
      created_at: Date(),
      id: user.id,
      usuario: user,
    };

    // verifica se o usuario que mandou a msg não é o mesmo do usuario ativo (no caso da pessoa estar conversando com ela mesma) para não duplicar a msg
    if (user.id != usuarioAtivo?.id)
      setMessages((oldArray) => [...oldArray, fakeMessage]);

    setMessage(""); // deixa o input vazio

    api
      .post("/mensagem-privada", conteudo)
      .then((response) => {})
      .catch((error) => {
        toast.error("Erro ao enviar mensagem.");
        setMessages((oldArray) => oldArray.slice(0, -1));
      });

    if (showEmoji) setShowEmoji(false);
  }

  function handleSendMessageWithEnter(event) {
    if (event.key == "Enter") {
      handleSendMessage(event);
      if (showEmoji) setShowEmoji(false);
    }
  }

  function addMessageToChat(data) {
    if (usuarioAtivo.id == data.message.usuario_id) {
      data.message.usuario = usuarioAtivo;
      data.message.vizualizado = true;
      setMessages((oldArray) => [...oldArray, data.message]);
      lerMensagensNaoLidas(usuarioAtivo);
    } else {
      notificate(data);
    }
  }

  function trocarUsuarioAtivo(usuario) {
    setUsuarioAtivo(usuario);
    fetchPrivateMessages(usuario);
    pusherContext.useUpdateMensagensNaoLidas.setUpdateMensagensNaoLidas(
      (value) => !value
    ); // atualiza o contador de messages nao lidas
  }

  function fetchPrivateMessages(usuario) {
    api
      .get("/mensagens-privadas/" + usuario?.id)
      .then((response) => {
        setMessages(response.data["data"]);
      })
      .catch((error) => {
        console.log(error);
      });

    lerMensagensNaoLidas(usuario);
  }

  function lerMensagensNaoLidas(usuario) {
    api
      .put("/ler-mensagens", { usuario_id: usuario?.id })
      .then((response) => {
        console.log("Qtde de messages lidas", response.data["data"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function notificate(data) {
    if (user["chat-status"] == "online")
      notification(
        `${data.message.usuario.nome} diz:`,
        data.message.message,
        foto
      ); // exibe a notificação de nova mensagem
    pusherContext.useUpdateMensagensNaoLidas.setUpdateMensagensNaoLidas(
      (value) => !value
    ); // atualiza o contador de messages nao lidas
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function addEmoji(emoji) {
    console.log(emoji);
    setMessage(message + emoji.native);
    setInputFocus();
  }

  return (
    <div>
      <Grid container component={Paper} className={"chat-box-container"}>
        <Grid item xs={3} className={"chat-box-contacts"}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <Avatar alt={user.nome} src={foto} />
              </ListItemIcon>
              <Typography
                variant="h5"
                component="h5"
                className={"contact-name"}
              >
                {user.nome}
              </Typography>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              label="Pesquisar por contato"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List className={"chat-box-contacts-container"}>
            {usuarios.map((item, index) => {
              console.log(item);
              if (usuarioAtivo && usuarioAtivo.id == item.id) item.ativo = true;
              else item.ativo = false;

              if (
                pusherContext.useUsuariosOnline.usuariosOnline.find(
                  (user) => user.id == item.id
                )
              ) {
                item.online = true;
              } else {
                item.online = false;
              }

              return (
                <ListItem
                  onClick={() => {
                    trocarUsuarioAtivo(item);
                  }}
                  className={item.ativo ? "active-contact" : ""}
                  key={item.id}
                  button
                >
                  <ListItemIcon>
                    <Avatar alt="User" src={index == 0 ? foto : null}>
                      {item.nome[0]}
                    </Avatar>
                  </ListItemIcon>
                  <Typography
                    variant="h5"
                    component="h5"
                    className={"contact-name"}
                  >
                    {item.nome} {index == 0 ? "- Eu" : ""}
                  </Typography>
                  <Typography variant="caption" className={"contact-subtitle"}>
                    {item.qtdeMensagensNaoLidas > 0
                      ? `${item.qtdeMensagensNaoLidas} novas mensagens`
                      : ""}{" "}
                  </Typography>
                  <div
                    className={[
                      "user-status",
                      item.online ? item["chat-status"] : "offline",
                    ].join(" ")}
                    style={{ marginLeft: "auto" }}
                  >
                    <p>⠀</p>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List className={"chat-box-background"}>
            {!usuarioAtivo && (
              <div className={"chat-box-no-user-selected"}>
                <h2>Selecione um contato para conversar</h2>
              </div>
            )}
            {messages.map((item) => {
              //Se o id do usuario que enviou a mensagem for difernte do id do usuario logado, exibe a mensagem na esquerda
              if (item.usuario_id != user.id) item.possicao = "left";
              else item.possicao = "right";
              return (
                <ListItem
                  className={`message-balloon-${item.possicao}`}
                  key={item.id}
                  align={item.possicao}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        className={"message-text"}
                        style={{
                          wordBreak: "break-word",
                          width: "fit-content",
                        }}
                        align={item.possicao}
                        primary={item.message}
                      ></ListItemText>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className={`message-subtitle-${item.possicao}`}
                    >
                      <Typography variant="caption" align={item.possicao}>
                        {moment(item.created_at).format("DD/MM HH:mm")}{" "}
                      </Typography>
                      {!item.vizualizado && (
                        <VisibilityOffIcon
                          color="primary"
                          className={"visualized-message-icon"}
                        />
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
            <div ref={messagesEndRef} />
          </List>

          <Grid
            container
            className={"text-box-background"}
            style={{ position: "relative" }}
          >
            <Grid item align="right">
              <InsertEmoticonIcon
                onClick={() => {
                  setShowEmoji((old) => !old);
                  setInputFocus();
                }}
                size="large"
                style={{
                  paddingTop: "15px",
                  paddingRight: "10px",
                  cursor: "pointer",
                  fontSize: "50px",
                }}
              />
              {showEmoji && (
                <Picker
                  onClick={(emoji) => {
                    addEmoji(emoji);
                  }}
                  style={{ position: "absolute", bottom: "96px", left: "0px" }}
                  title=""
                  emoji=""
                  theme="dark"
                  showPreview={false}
                  i18n={emojiConfig}
                />
              )}
            </Grid>
            <Grid item xs={10}>
              <TextField
                onChange={handleMessageChange}
                onKeyPress={handleSendMessageWithEnter}
                id="text-field"
                value={message}
                placeholder="Digite aqui"
                fullWidth
                inputRef={inputRef}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab onClick={handleSendMessage} color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Chat;
