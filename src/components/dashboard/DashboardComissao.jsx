function DashboardComissao({ dados }) {
    function getTexto() {
        if (dados?.diferencaPercentual > 0) {
            return `Este mês estamos operando ${dados?.diferencaPercentual?.toFixed(2)?.replace('.', ',')}% acima da média.`
        }
        else if (dados?.diferencaPercentual < 0) {
            return `Este mês estamos operando ${dados?.diferencaPercentual?.toFixed(2)?.replace('.', ',')}% abaixo da média.`
        }
        else {
            return `Este mês estamos operando no zero a zero.`
        }
    }
    return <div style={{ fontSize: 18, marginBottom: 4 }}>{getTexto()}</div>
}

export default DashboardComissao;
