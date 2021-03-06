import _ from "lodash";

/** Transforma um objeto em array.
 * @param {Object} obj Objeto a ser transformado em array.
 * @returns {Array} Array com os valores do objeto.
 * @example
 * const obj = {
 *  a: 1,
 *  b: 2,
 *  c: 3
 * }
 * 
 */
export function objectToArray(obj) {
  return Object.keys(obj).map(function (key) { return obj[key]; });
}

/**  Remove um elemento de um array por chave: valor.
 * @param {Array} array Array a ser modificado.
 * @param {String} key Atributo a ser usado para a busca.
 * @param {String} value Valor do atributo a ser usado para a busca.
 * @returns {Array} Array modificado.
 * @example
 * const array = [
 *   {
 *     id: 1,
 *    nome: 'João'
 *   },
 *   {
 *    id: 2,
 *    nome: 'Maria'
 *   }
 * ]
 * 
 */
export function removeFromArrayByKeyValue(array, key, value) {
  const index = array.findIndex(obj => obj[key] === value);
  return index >= 0 ? [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ] : array;
}

/** Move um elemento para o inicio de um array.
 * @param {Array} array Array a ser modificado.
 * @param {Number} index Posição do elemento a ser movido.
 * @param {Number} newIndex Posição do elemento apos ser movido
 * @returns {Array} Array modificado.
 * 
 */
export function moveObjectInArray(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0]);
  return array;
}


/** Deleta um elemento de um array.
 * @param {Array} array Array a ser modificado.
 * @param {Number} index Posição do elemento a ser movido.
 * @returns {Array} Array modificado.
 * 
 */
export function deleteFromArrayByIndex(array, index) {
  return array.filter((item, i) => i !== index);
}

/** Remove os objetos duplicados de um array por um atributo
 * @param {Array} array Array a ser modificado.
 * @param {String} key Atributo a ser usado para a busca.
 * @returns {Array} Array modificado.
 * 
 */
export function getUniqueArrayOfObjectsByKey(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

/** Compara dois arrays (nested arrays), e retorna true ou false se forem iguais.
 * @param {Array} array Array a ser comparado.
 * @param {Array} array Array a ser comparado.
 * @returns {Boolean} true se arrays forem iguais ou false se forem diferentes.
 * 
 */
export function isArrayEqual(arr1, arr2) {
  return _(arr1).differenceWith(arr2, _.isEqual).isEmpty();
};

export function getBase64FromFile(file, callback = ()=>{}) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
      callback(reader.result)
  };
  reader.onerror = function (error) {
      console.log('Error: ', error);
  };
}

