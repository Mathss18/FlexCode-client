import { Avatar } from "@mui/material";
import Badge from "@material-ui/core/Badge";

import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useRef, useState } from "react";
import { getFromLS, setToLS } from "../utils/storage";
import { Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { usePusherContext } from "../context/PusherContext";
import api from "../services/api";
import statuses from "../constants/userStatus";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [status, setSataus] = useState(getFromLS("user-status"));
  const [currentStatus, setCurrentStatus] = useState(
    status ? status.find((item) => item.selected === true) : statuses[0]
  );
  const pusherContext = usePusherContext();
  const user = getFromLS("user");
  const foto = localStorage.getItem("foto");
  const history = useHistory();
  var indexCurrentStatus;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    api
      .get("/usuarios/" + user?.id)
      .then((response) => {
        let statusAtual = status.filter(
          (item) => item.class === response.data["data"]["chat-status"]
        );

        status.forEach((item, index) => {
          if (item.class === statusAtual[0].class) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
        setSataus(status);
        setCurrentStatus(status.find((item) => item.selected === true));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function handleOnOpen(event) {
    var itemClicado = event.target.classList[0];

    if (itemClicado !== "user-status") {
      setOpen((open) => !open);
    } else if (itemClicado === "user-status") {
      indexCurrentStatus = status.findIndex((item) => item.selected === true);

      // Verifica se o próximo status a ser selecionado não ultrassa o limite do array
      if (indexCurrentStatus + 1 > status.length - 1) {
        // se ultrapassar, seleciona o primeiro status do array novamente
        status[0].selected = true;
        status[indexCurrentStatus].selected = false;
      } else {
        // se não ultrapassar, seleciona o próximo status do array
        status[indexCurrentStatus].selected = false;
        status[indexCurrentStatus + 1].selected = true;
      }

      setSataus(status);
      setCurrentStatus(status.find((item) => item.selected === true));
      setToLS("user-status", status);

      api
        .put("/trocar-chat-status", {
          id: user.id,
          status: status.find((item) => item.selected === true).class,
        })
        .then((response) => {
          let user = getFromLS("user");
          user["chat-status"] = status.find(
            (item) => item.selected === true
          ).class;
          setToLS("user", user);
          pusherContext.useUpdateUserStatus.setUpdateUserStatus((old) => !old);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <div className={"user-container"} ref={wrapperRef}>
      <Badge
        onClick={handleOnOpen}
        className={"user-badge"}
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <Tooltip title={currentStatus.descricao} arrow>
            <div className={["user-status", currentStatus.class].join(" ")}>
              <p>⠀</p>
            </div>
          </Tooltip>
        }
      >
        {<Avatar
          alt={user.nome}
          className={"user-photo"}
          src={foto}
          sx={{ width: 48, height: 48 }}
        >{user.nome[0]}</Avatar>}
      </Badge>
      <div className={[open ? "active" : "inactive", "user-list"].join(" ")}>
        <h3>
          {user.nome}
          <br />
          <span>Allmacoding</span>
        </h3>
        <ul className={"user-list-container"}>
          <li className={"user-list-item"}>
            <PersonIcon className={"user-list-icon"} />
            <a>Meu Perfil</a>
          </li>
          <li
            className={"user-list-item"}
            onClick={() => {
              history.push("/chat");
              setOpen(false);
            }}
          >
            <SendIcon className={"user-list-icon"} />
            <a>Chat</a>
          </li>
          <li
            className={"user-list-item"}
            onClick={() => {
              history.push("/configuracoes");
              setOpen(false);
            }}
          >
            <SettingsIcon className={"user-list-icon"} />
            <a>Configurações</a>
          </li>
          <li
            className={"user-list-item"}
            onClick={() => {
              history.push("/ajuda");
            }}
          >
            <HelpIcon className={"user-list-icon"} />
            <a>Ajuda</a>
          </li>
          <li
            className={"user-list-item"}
            onClick={() => {
              pusherContext.useIsLogged.setIsLogged(false);
              localStorage.removeItem("token");
              history.push("/login");
            }}
          >
            <LogoutIcon className={"user-list-icon"} />
            <a>Sair</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserMenu;
