import _ from 'lodash';

export const isEmptyArray= (value)=> {
  return Array.isArray(value) && _.isEmpty(value)
}