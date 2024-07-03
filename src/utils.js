export const nvl = (valor, defaultValue = 0) =>
  valor === undefined || valor === '' || valor === null ? defaultValue : valor;

/**
 * Función para formatear la fecha con el formato -> 'dd-mm-aaaa HH-mm-ss' de Argentina
 * @param {String} dateParam
 * @returns Fecha formateada en string
 */
export const formatDateArg = (dateParam) => {
  const date = new Date(dateParam);
  const hora = menorADiez(date.getHours());
  const minutos = menorADiez(date.getMinutes());
  const segundos = menorADiez(date.getSeconds());

  const dia = menorADiez(date.getDate() + 1);
  const mes = menorADiez(date.getMonth() + 1);
  const anio = date.getFullYear();
  return `${dia}-${mes}-${anio} ${hora}:${minutos}:${segundos}`;
};

export const menorADiez = (number) => {
  return number < 10 ? `0${number}` : number;
};

export const sumarDias = (fecha, dias) => {
  // Clonar la fecha para no modificar la original
  const nuevaFecha = new Date(fecha);
  // Restar 90 días
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
};
