import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    font-family: ${({ theme }) => theme.font} !important; // fonte de toda a aplicação
  }
  
  body {
    background: ${({ theme }) => theme.colors.body}; // cor de fundo da aplicação
    color: ${({ theme }) => theme.colors.text}; // cor padrao do texto da aplicação
    font-family: ${({ theme }) => theme.font}; // fonte da aplicação
  }

  a {
    color: ${({ theme }) => theme.colors.link.text}; // cor do texto de links
    cursor: pointer; // cursor tipo pointer ao passar o mouse sobre links
  }

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-button {
      display: none;
      width: 0;
      height: 0;
  }

  ::-webkit-scrollbar-corner {
      background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
      background-color: #4a4d52;
      border: 0px solid #282a2d;
      border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover{
    background: #5c5f64;
  }

  /* ========= INPUT ========= */

  input {
    background: ${({ theme }) => theme.colors.input.background} !important; // cor de fundo dos inputs
    color: ${({ theme }) => theme.colors.input.text} !important; // cor do texto dentro dos inputs (usuario)
    border-radius: 5px !important;
  }

  .MuiFormControl-root > * {
    color: ${({ theme }) => theme.colors.input.text} !important; // cor do texto dentro dos inputs (label)
  }

  .MuiFormHelperText-root{
    color: ${({ theme }) => theme.colors.button.error.background} !important; // cor do texto helper do input quando está com erro
  }

  .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline{
    border-color: ${({ theme }) => theme.colors.button.error.background} !important; // cor da borda do input com erro
  }
  
  .input-select{
    background: ${({ theme }) => theme.colors.input.background} !important; // cor de fundo input select
    border-radius: 5px;
  }
  
  .MuiOutlinedInput-adornedEnd{
    cursor: pointer; // cursor tipo pointer ao passar o mouse em cima do elemento no fim do input
    background: ${({ theme }) => theme.colors.input.background} !important; // cor de fundo input quando há elemento html dentro dele (nesse caso no fim, ex: tela de grade-variacao)
  }

  /* ========= TOP BAR ========= */

  .topbar{
    background: ${({ theme }) => theme.colors.topbar.background}; // cor de fundo da topbar
    box-shadow: none; // sombra inferior da topbar
    border-bottom: 1px solid transparent !important; // borda inferior da topbar
    z-index: 2000; // z-index da topbar
  }

  .user-badge{
    cursor: pointer; // cursor tipo pointer ao passar o mouse sobre o badge do usuario

  }
  .MuiAvatar-img{ 
    transition: height 0.3s;
    transition-timing-function: ease-in-out // animação de transição do avatar do usuario 
  }

  .MuiAvatar-img:hover{ 
    height: 150%; // largura do badge do usuario quando o mouse está sobre ele
  }

  .user-status{
    background: #000; // cor de fundo do status do usuario
    width: 12px; // largura do status do usuario
    height: 12px; // altura do status do usuario
    clip-path: circle(); // faz com que o status do usuario fique em forma de circulo
  }

  .online{
    background: #92c353 !important; // cor de fundo do status do usuario (online)
  }
  .busy{
    background: #d74654 !important; // cor de fundo do status do usuario (ocupado)
  }
  .away{
    background: #fdb913 !important; // cor de fundo do status do usuario (ausente)
  }
  .offline{
    background: #747f8d !important; // cor de fundo do status do usuario (invisivel)
  }

  .MuiBadge-anchorOriginBottomRightCircular{
    background: transparent !important; // cor de fundo do status do usuario
  }
  

  .topbar-spacing{
    flex-grow: 1; // espeçamento central da topbar (jogando os icones para os cantos)
  }

  .topbar-icon{
    padding-right: 20px; // espaçamento entre os icones da topbar
  }

  .MuiBadge-badge{
    background: #c65656; // circulo de alerta dos icones da topbar (ex: alerta de nova mensagem(4) )
  }

  /* ========= TOP BAR USER MENU ========= */

  .user-list {
    position: absolute; // posiciona a lista de forma absoluta 
    top: 80px;
    right: 10px;
    background: #393f44; // cor de fundo da lista do usuario
    width: 200px; // tamanho da lista do usuario
    border-radius: 15px; // tamanho da borda da lista do usuario
    transition: 0.5s; // tempo de transição da lista do usuario
    visibility: hidden;
    opacity: 0;
  }

  .user-list.active {
    visibility: visible;
    opacity: 1;
  }

  .user-list::before {
    content: "";
    position: absolute;
    top: -5px;
    right: 28px;
    width: 20px;
    height: 20px;
    background: #393f44;
    transform: rotate(45deg);
  }

  .user-list-item{
    padding-left: 20px; // espaçamento entre os itens da lista do usuario
    padding-top: 12px !important; // espaçamento superior entre os itens da lista do usuario
    padding-bottom: 12px !important; // espaçamento inferior entre os itens da lista do usuario
  }

  .user-list-item:hover{
    cursor: pointer; // cursor tipo pointer ao passar o mouse sobre os itens da lista do usuario
    background: #2f3136; // cor de fundo do item da lista do usuario quando o mouse está sobre ele
  }

  .user-list-container{
    padding-left: 0px; // espaçamento esquedo do container dos itens da lista do usuario
    
  }

  .user-list h3 {
    text-align: center;
    font-size: 18px;
    padding: 10px 0;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5em;
  }

  .user-list h3 span {
    font-size: 14px;
    color: #cecece;
    font-weight: 300;
  }

  .user-list ul li {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
  }

  .user-list ul li a {
    display: inline-block;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
    transition: 0.5s;
    padding-left: 10px;
  }

  .user-list ul li:hover a {
    color: ${({ theme }) => theme.colors.link.text};
  }

  .user-list-icon{
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
  }

  /* ========= Side Menu ========= */

  .MuiDrawer-paper{  
    background: ${({ theme }) => theme.colors.sidemenu.background}; // cor de fundo do sidemenu
    border-right: none; // borda direita do sidemenu;
  }

  .MuiListItem-root path{
    color: ${({ theme }) => theme.colors.input.text} // cor da seta de expansão dos drawers do sidemenu
  }

  .sidemenu-list{
    border-top: none !important; // borda superior do sidemenu
    margin-top: -1px;
    margin-bottom: -1px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.sidemenu.background}; // borda inferior do sidemenu
  }

  .sidemenu-text{
    color: ${({ theme }) => theme.colors.sidemenu.text}; // cor do texto do sidemenu
  }

  #nested-list-subheader{
    color: ${({ theme }) => theme.colors.sidemenu.text} //cor do titulo do sidemenu;
  }

  /* ========= Tabela ========= */

  .table-background{
    background: ${({ theme }) => theme.colors.table.header.background}; // cor de fundo header e footer tabela
    color: ${({ theme }) => theme.colors.table.header.text}; // titulo tabela
  }
  
  .table-background span{
    color: ${({ theme }) => theme.colors.table.header.text}; // icones header tabela
  }

  .MuiTableCell-head{
    border-bottom: none; // borda inferior header tabela
    background: ${({ theme }) => theme.colors.table.header.background}; // fundo header tabela
  }

  .MuiTableCell-body{
    border-bottom: none; // borda inferior body tabela
  }

  
  .MuiTableCell-footer{
    border-bottom: none; // borda footer tabela
  }
  
  .MuiTablePagination-caption, .MuiTablePagination-selectIcon, #pagination-rows{
    color: ${({ theme }) => theme.colors.table.footer.text}; // cor informação footer tabela (linhas por pág, itens por página,...)
  }

  .datatables-noprint{
    color: ${({ theme }) => theme.colors.table.header.text}; // "Nenhum resultado encontrado" na tabela
  }


  // -* Row Par *- //
  .row-par > *{ 
    background: ${({ theme }) => theme.colors.table.row.par.background}; // cor de fundo da linha da tabela quando a linha for par
    color: ${({ theme }) => theme.colors.table.row.par.text}; ; // cor de texto da linha da tabela quando a linha for par
    border: none; // borda da tabela quando a linha for par
  }

  .row-par:hover > *{ 
    background: ${({ theme }) => theme.colors.table.row.par.hover} !important; // cor de fundo da linha da tabela quando a linha for par e o mouse estiver sobre ela
  }


  // -* Row Impar *- //

  .row-impar > *{
    background: ${({ theme }) => theme.colors.table.row.impar.background}; // cor de fundo da linha da tabela quando a linha for impar
    color: ${({ theme }) => theme.colors.table.row.impar.text}; // cor de texto da linha da tabela quando a linha for impar 
    border: none;
  }

  .row-impar:hover > *{
    background: ${({ theme }) => theme.colors.table.row.impar.hover} !important; // cor de fundo da linha da tabela quando a linha for impar e o mouse estiver sobre ela
  }
  



  /* ========= Botoes ========= */

  .btn {
    
  }

  .btn-primary {
    background: ${({ theme }) => theme.colors.button.primary.background}; // cor de fundo do botao primario
    color: ${({ theme }) => theme.colors.button.primary.text}; // cor do texto do botao primario
    border: 1px solid ${({ theme }) => theme.colors.button.primary.border}; // cor da borda do botao primario
  }
  .btn-primary:hover{
    background: ${({ theme }) => theme.colors.button.primary.hover.background}; // cor de fundo do botao primario quando o mouse estiver sobre ele
    color: ${({ theme }) => theme.colors.button.primary.hover.text}; // cor do texto do botao primario quando o mouse estiver sobre ele
  }



  .btn-secondary {
    background: ${({ theme }) => theme.colors.button.secondary.background}; // cor de fundo do botao secundario
    color: ${({ theme }) => theme.colors.button.secondary.text}; // cor do texto do botao secundario
    border: 1px solid ${({ theme }) => theme.colors.button.secondary.border}; // cor da borda do botao secundario
  }
  .btn-secondary:hover{
    background: ${({ theme }) => theme.colors.button.secondary.hover.background}; // cor de fundo do botao secundario quando o mouse estiver sobre ele
    color: ${({ theme }) => theme.colors.button.secondary.hover.text}; // cor do texto do botao secundario quando o mouse estiver sobre ele
  }



  .btn-success {
    background: ${({ theme }) => theme.colors.button.success.background}; // cor de fundo do botao sucesso 
    color: ${({ theme }) => theme.colors.button.success.text}; // cor do texto do botao sucesso
    border: 1px solid ${({ theme }) => theme.colors.button.success.border}; // cor da borda do botao sucesso
  }
  .btn-success:hover{
    background: ${({ theme }) => theme.colors.button.success.hover.background}; // cor de fundo do botao successo quando o mouse estiver sobre ele
    color: ${({ theme }) => theme.colors.button.success.hover.text}; // cor do texto do botao sucesso quando o mouse estiver sobre ele
  }



  .btn-error {
    background: ${({ theme }) => theme.colors.button.error.background}; // cor de fundo do botao erro 
    color: ${({ theme }) => theme.colors.button.error.text}; // cor do texto do botao erro
    border: 1px solid ${({ theme }) => theme.colors.button.error.border}; // cor da borda do botao erro
  }
  .btn-error:hover{
    background: ${({ theme }) => theme.colors.button.error.hover.background}; // cor de fundo do botao erro quando o mouse estiver sobre ele
    color: ${({ theme }) => theme.colors.button.error.hover.text}; // cor do texto do botao de erro quando o mouse estiver sobre ele
  }



  .btn-lista{
    border: 1px solid #475162;
    border-radius: 6px;
    box-shadow: 2px 2px #475162;
    background: ${({ theme }) => theme.colors.button.info.background};
    color: ${({ theme }) => theme.colors.button.info.text};
    margin-right: 8px;
    padding: 2;
    font-size: 28px;
    cursor: pointer;
  }
  .btn-lista:hover{
    background: ${({ theme }) => theme.colors.button.info.hover.background};
    color: ${({ theme }) => theme.colors.button.info.hover.text};
  }

  .btn-spacing{
    margin-top: 12px;
    margin-bottom: 12px;
    margin-right: 12px;
  }

  /* ========= CHART ========= */

  .chart-container{
    background: ${({ theme }) => theme.colors.chart.background};
  }

  /* ========= POPUP ========= */

  .swal2-popup {
    background: ${({ theme }) => theme.colors.popup.background};
    color: ${({ theme }) => theme.colors.popup.text};
  }

  .swal2-title {
    color: ${({ theme }) => theme.colors.popup.text};
  }

  .swal2-html-container{
    color: ${({ theme }) => theme.colors.popup.text};
  }

  .swal2-confirm {
    background-color: ${({ theme }) => theme.colors.popup.button.confirm.background} !important;
  }

  /* ========= TOAST ========= */

  .toast-container{
    color: ${({ theme }) => theme.colors.toast.text};
    background: ${({ theme }) => theme.colors.toast.background}
  }

`;