import logoEmpresa from "../assets/logoEmpresa.svg";
import instagramLogo from "../assets/instagramLogo.png";

function OrdensServicosReport() {
  return (
    <div className="report-ordens-servicos">
      <div className="report-ordens-servicos-header">
        <img src={logoEmpresa} alt="Logo Empresa" />
      </div>
      <div className="report-ordens-servicos-header-info"></div>
      {window.print()}
    </div>
  );

}

export default OrdensServicosReport;
