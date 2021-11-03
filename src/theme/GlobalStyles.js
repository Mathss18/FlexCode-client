import { createGlobalStyle } from "styled-components";

export function alternateRowColor() {
  console.log( ({ theme }) => theme.colors.primary );
  var tableRowBgColor = "lightgrey";
  return tableRowBgColor;
}


export const GlobalStyles = createGlobalStyle`
  * {
    font-family: ${({ theme }) => theme.font} !important;
  }
  
  body {
    background: ${({ theme }) => theme.colors.body};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font};
    
  }

  a {
    color: ${({ theme }) => theme.colors.link.text};
    cursor: pointer;
  }

  input {
    background: ${({ theme }) => theme.colors.input.background} !important;
    border-radius: 5px !important;
  }
  
  .input-select{
    background: ${({ theme }) => theme.colors.input.background} !important;
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

  /* ========= Side Menu ========= */

  .MuiDrawer-paper{  
    background: ${({ theme }) => theme.colors.body};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
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
    background: ${({ theme }) => theme.colors.body};
  }

  .MuiTableCell-head{
    background: ${({ theme }) => theme.colors.body};
  }

  .MuiTableCell-footer{
    border-bottom: none;
  }

  .row-par{ 
    background: ${({ theme }) => theme.colors.table.row.par.background};
  }

  .row-impar{
    background: ${({ theme }) => theme.colors.table.row.impar.background};
  }
  
  .row:hover{
    background: ${({ theme }) => theme.colors.table.row.hover} !important;
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
    border: 1px solid ${({ theme }) => theme.colors.button.info.background};
    border-radius: 6px;
    box-shadow: 2px 2px #757575;
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

`;