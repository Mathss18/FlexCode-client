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

  input {
    background: ${({ theme }) => theme.colors.input.background} !important; // cor de fundo dos inputs
    color: ${({ theme }) => theme.colors.input.text} !important; // cor do texto dentro dos inputs (usuario)
    border-radius: 5px !important;
  }

  .MuiFormControl-root > * {
    color: ${({ theme }) => theme.colors.input.text} !important; // cor do texto dentro dos inputs (label)
  }

  .MuiFormHelperText-root.Mui-error{
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
    background: ${({ theme }) => theme.colors.input.background} !important;
  }

  /* ========= Top Bar ========= */

  .topbar{
    background: ${({ theme }) => theme.colors.topbar.background};
    box-shadow: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    z-index: 2000;
  }

  .topbar-spacing{
    flex-grow: 1;
  }

  .topbar-icon{
    padding-right: 20px;
  }

  .MuiBadge-badge{
    background: #c65656; // icones top bar
  }
  

  /* ========= Side Menu ========= */

  .MuiDrawer-paper{  
    background: ${({ theme }) => theme.colors.sidemenu.background};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }

  .MuiListItem-root path{
    color: #8a8d93;
  }

  .sidemenu-list{
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin-top: -1px;
    margin-bottom: -1px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  .sidemenu-text{
    color: ${({ theme }) => theme.colors.sidemenu.text};
  }

  #nested-list-subheader{
    color: ${({ theme }) => theme.colors.sidemenu.text};
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
    background: ${({ theme }) => theme.colors.table.header.background}; // fundo header tabela
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
    background: ${({ theme }) => theme.colors.table.row.par.background};
    color: ${({ theme }) => theme.colors.table.row.par.text};
    border: none;
  }

  .row-par:hover > *{ 
    background: ${({ theme }) => theme.colors.table.row.par.hover} !important;
  }


  // -* Row Impar *- //

  .row-impar > *{
    background: ${({ theme }) => theme.colors.table.row.impar.background};
    color: ${({ theme }) => theme.colors.table.row.impar.text};
    border: none;
  }

  .row-impar:hover > *{
    background: ${({ theme }) => theme.colors.table.row.impar.hover} !important;
  }
  



  /* ========= Botoes ========= */

  .btn {
    
  }

  .btn-primary {
    background: ${({ theme }) => theme.colors.button.primary.background};
    color: ${({ theme }) => theme.colors.button.primary.text};
    border: 1px solid ${({ theme }) => theme.colors.button.primary.border};
  }
  .btn-primary:hover{
    background: ${({ theme }) => theme.colors.button.primary.hover.background};
    color: ${({ theme }) => theme.colors.button.primary.hover.text};
  }



  .btn-secondary {
    background: ${({ theme }) => theme.colors.button.secondary.background};
    color: ${({ theme }) => theme.colors.button.secondary.text};
    border: 1px solid ${({ theme }) => theme.colors.button.secondary.border};
  }
  .btn-secondary:hover{
    background: ${({ theme }) => theme.colors.button.secondary.hover.background};
    color: ${({ theme }) => theme.colors.button.secondary.hover.text};
  }



  .btn-success {
    background: ${({ theme }) => theme.colors.button.success.background};
    color: ${({ theme }) => theme.colors.button.success.text};
    border: 1px solid ${({ theme }) => theme.colors.button.success.border};
  }
  .btn-success:hover{
    background: ${({ theme }) => theme.colors.button.success.hover.background};
    color: ${({ theme }) => theme.colors.button.success.hover.text};
  }



  .btn-error {
    background: ${({ theme }) => theme.colors.button.error.background};
    color: ${({ theme }) => theme.colors.button.error.text};
    border: 1px solid ${({ theme }) => theme.colors.button.error.border};
  }
  .btn-error:hover{
    background: ${({ theme }) => theme.colors.button.error.hover.background};
    color: ${({ theme }) => theme.colors.button.error.hover.text};
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

  /* ========= POPUP ========= */

  .popup {
    background: ${({ theme }) => theme.colors.popup.background};
    color: ${({ theme }) => theme.colors.popup.text};
  }
`;