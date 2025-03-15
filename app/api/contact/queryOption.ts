import Queries from './queries';
import {User} from '@/@types/user';
import CommQuery from '../_comm/queries';
import { Contact } from './@type';

const name= 'contact';
// const Query= new Queries(name)
const Query= new CommQuery<Contact>(name)
const queryKeys = {
  all: [name] as const,
  list: (page: number, size?: number) => [`${name}-list`, page, size] as const,
  item: (id: string)=> [`${name}-item`, id] as const,
  infiniteList: () => [`${name}-list`] as const,
  create: [`${name}-create`] as const,
  update: [`${name}-update`] as const,
  delete: [`${name}-delete`] as const,
  deletes: [`${name}-deletes`] as const,
  filter: (page: number, size?: number) => [`${name}-filter`, page, size] as const,
}

const queryOptions = {
  name,
  create: () => ({
    queryKey: queryKeys.update,
    queryFn: Query.createData,
  }),
  list: ( page: number, size?: number ) => ({
    queryKey: queryKeys.list(page, size),
    queryFn: (params)=>{
      return Query.getDataList({ url: `/api/${name}/list`, page, size })
    },
  }),
  item: (id) => ({
    queryKey: queryKeys.item(id),
    queryFn: (params)=>{
      return Query.getData(id)
    },
  }),
  filter: ( page: number, size?: number ) => ({
    queryKey: queryKeys.filter(page, size),
    queryFn: (params)=>{
      return Query.filterDataList({ params, page, size  })
    },
  }),
  update: (id) => ({
    queryKey: queryKeys.update,
    queryFn: (params)=> Query.updateData({params, id}),
  }),
  delete: (id) => ({
    queryKey: queryKeys.delete,
    queryFn:(params)=> Query.deleteData({params, id}),
  }),
  deletes: ( ids ) => ({
    queryKey: queryKeys.update,
    queryFn:(params)=> Query.deletesData({params, ids}),
    
  }),
};


export default queryOptions;