const empresaConfig = JSON.parse(localStorage.getItem("config"));

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: empresaConfig?.quantidadeCasasDecimaisValor,
});

export const brPrice = {
  valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  cellClassName: "font-tabular-nums",
};
