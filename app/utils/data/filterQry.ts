import _ from 'lodash';

export type InputFilter= {
  id: string|number
  name: string
  key: string
  value: InputFilter[]|any
}
const Operator= {
  '=':'equals',
  '!=':'does not equal',
  '>':'more than',
  '>=':'more than or equal',
  '<':'less than',
  '<=':'less than or equal',
  'LIKE':'contains',
  'NOTLIKE':'does not contain',
  'LIKE%': 'begins with',
  '%LIKE': 'ends with',
  'IN': 'in',
  'ISNULL':'is blank',
  'NOTISNULL':'is not blank'
} as const
export type OperatorType= keyof typeof Operator;
type OperatorValue= (typeof Operator)[OperatorType];
// type OperatorType= '='|'!='|'>'|'>='|'<'|'<='|'is blank'|'is not blank'
// type OptionType= 'contains'|'does not contain'|'equals'|'does not equal'|'begins with'|'ends with'|'is blank'|'is not blank'
export interface FilterType {
  type: 'filter'
  id: string|number
  option: OperatorType
  key: string
  value: string|number|(string|number)[]
}
export interface GroupFilterType {
  type: 'group'
  id: string|number
  operator: 'AND'|'OR'
  filter: FiltersType[]
}
export type FiltersType= GroupFilterType|FilterType
interface GroupFilterProp {
  filters: { [key: string]: string }
}
// export const groupQryFilter= ({filters}):GroupFilterType=> {
//    return {

//    }
// }
// export const qryFilter= ({filter})=> {

// }

interface GqlFilterProps {
  filter: any
  type?:'item'|'part'
  name?: string
}

const gqlFiltersType= ( {filter, type, name}:GqlFilterProps )=> {
  const items= gqlFilters(filter);
  let res= items;
  if( type == 'part' ){
    res= { part: items, name: name }
  }
  return res;
}

const gqlFilters= ( filter )=> {
  const items= filter.map(val=> {
    const [keyValue]= Object.entries(val);
    
    return {
      item: {
        action: val.act || "=",
        value: {
            [keyValue[0]]: keyValue[1]
        }
      },
      oper: val.oper || "AND",
      name: val?.name
    }
  });
  return items;
}

const gqlCursorFilters= ( filter, len )=> {
  return filter.map(val=> {
    let key, value;
    if( val.constructor == Object ) {
      const [keyValue]= Object.entries(val);
      key= keyValue[0];
      value= keyValue[1];
    } else {
      key= val;
      value= "0";
    }

    return {
      item: {
        action: len || "10",
        value: {
          [key]: value
        }
      },
      oper: "AND"
    }
  })
}


type JoinData= {
  dataL: any
  dataR: any
  nameL: string
  nameR: string
}
/* const joinDatas= ( datas: JoinData )=> {
  const { dataL, dataR, nameL, nameR }= datas
  const left= dataL;
  const right= dataR;
  const accL= (obj)=> obj[nameL];
  const accR= (obj)=> obj[nameR];
  const res= _.hashLeftOuterJoin(left, accL, right, accR);
  return res;
}
const joinRightOuterDatas= ( datas: JoinData )=> {
  const { dataL, dataR, nameL, nameR }= datas
  const left= dataL;
  const right= dataR;
  const accL= (obj)=> obj[nameL];
  const accR= (obj)=> obj[nameR];
  const res= _.hashRightOuterJoin(left, accL, right, accR);
  return res;
} */


const fieldMatching= ( matchFields, matchFieldName )=> {
  const field= matchFields.find( d=> d[`match`] == matchFieldName );
  return field
}

export { gqlFiltersType, gqlFilters, gqlCursorFilters, fieldMatching }



export const searchTree= ({node, id, go, set}:{ 
  node:FiltersType, id:string, go:any, set:(node:FiltersType)=> FiltersType
})=> {
  const { type }= node;
  if( node.id == id ) {
    go.current= false;
    if( set ) return set(node)
  }
  if( type == 'group' ){
    const filter= node.filter
    if( go.current ) filter.map((ft)=> searchTree({node: ft, id, go, set}))
  }
  
  return node;
}