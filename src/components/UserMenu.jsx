import { Avatar } from '@mui/material';
import Badge from '@material-ui/core/Badge';
import user from '../assets/user2.jpg';

import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { getFromLS, setToLS } from '../utils/storage';
import { Tooltip } from '@material-ui/core';
import { useHistory } from "react-router-dom";



function UserMenu() {
  const [open, setOpen] = useState(false);
  const [status, setSataus] = useState(getFromLS('user-status'));
  const [currentStatus, setCurrentStatus] = useState(status.find(item => item.selected === true));
  const history = useHistory();
  var indexCurrentStatus;


  function handleOnOpen(event) {

    var itemClicado = event.target.classList[0];

    if (itemClicado === 'MuiAvatar-img') {
      setOpen((open) => !open);
    }
    else if (itemClicado === 'user-status') {
      indexCurrentStatus = status.findIndex(item => item.selected === true)

      // Verifica se o próximo status a ser selecionado não ultrassa o limite do array
      if (indexCurrentStatus + 1 > status.length - 1) {
        // se ultrapassar, seleciona o primeiro status do array novamente
        status[0].selected = true;
        status[indexCurrentStatus].selected = false;
      }
      else {
        // se não ultrapassar, seleciona o próximo status do array
        status[indexCurrentStatus].selected = false;
        status[indexCurrentStatus + 1].selected = true;
      }
      setSataus(status);
      setCurrentStatus(status.find(item => item.selected === true))
      setToLS('user-status', status);

    }

  }

  return (
    <div className={'user-container'}>
      <Badge
        onClick={handleOnOpen}
        className={'user-badge'}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Tooltip title={currentStatus.descricao} arrow>
            <div className={['user-status', currentStatus.class].join(" ")} style={{ background: status ? 'green' : 'red' }}><p>⠀</p></div>
          </Tooltip>
        }
      >
        <Avatar alt="Travis Howard" className={'user-photo'} src={user} sx={{ width: 48, height: 48 }} />
      </Badge>
      <div className={[open ? 'active' : 'inactive', 'user-list'].join(" ")}>
        <h3>Fulano da Silva<br /><span>Programador de Software</span></h3>
        <ul className={'user-list-container'}>
          <li className={'user-list-item'}>
            <PersonIcon className={'user-list-icon'} /><a>Meu Perfil</a>
          </li>
          <li className={'user-list-item'}>
            <SendIcon className={'user-list-icon'} /><a>Chat</a>
          </li>
          <li className={'user-list-item'}>
            <SettingsIcon className={'user-list-icon'} /><a>Configurações</a>
          </li>
          <li className={'user-list-item'}>
            <HelpIcon className={'user-list-icon'} /><a>Ajuda</a>
          </li>
          <li className={'user-list-item'} onClick={() => {localStorage.removeItem('token'); history.push("/login")}}>
            <LogoutIcon className={'user-list-icon'}/><a>Sair</a>
          </li>
        </ul>
      </div>
    </div>


  );
}

export default UserMenu;