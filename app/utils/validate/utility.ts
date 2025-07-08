import _ from 'lodash';

export const isEmptyArray= (value)=> {
  return Array.isArray(value) && _.isEmpty(value)
}

export function mbToBytes(mb) {
  return mb * 1024 * 1024;
}

export function bytesToMb(bytes, decimals = 2) {
  return (bytes / (1024 * 1024)).toFixed(decimals);
}