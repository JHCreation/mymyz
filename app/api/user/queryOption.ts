import Query from '@/api/user/queries';
import {User} from '@/@types/user';
import CommQuery from '../_comm/queries';

const name= 'user';
const UserQuery= new Query(name)
const Comm_Query= new CommQuery(name)
const queryKeys = {
  signin: ['user-signin'] as const,
  login: ['user-login'] as const,
  snsLogin: (type)=> ['user-sns-login', type] as const,
  logout: ['user-logout'] as const,
  refresh: ['user-refresh'] as const,
  create: [`${name}-create`] as const,
  update: [`${name}-update`] as const,
  delete: [`${name}-delete`] as const,
  deletes: [`${name}-deletes`] as const,
  filter: (page: number, size?: number) => [`${name}-filter`, page, size] as const,
}

const queryOptions = {
  name,
  signin: () => ({
    queryKey: queryKeys.signin,
    queryFn: Comm_Query.createData,
  }),
  login: () => ({
    queryKey: queryKeys.login,
    queryFn: UserQuery.userLogin,
  }),

  snsLogin: ({type, id}) => ({
    queryKey: queryKeys.snsLogin(type),
    queryFn: UserQuery.snsLogin(id),
    // queryFn: (param)=> UserQuery.snsLogin(id),
  }),
  logout: ()=> ({
    queryKey: queryKeys.logout,
    queryFn: UserQuery.userLogout,
  }),
  refresh: ()=> ({
    queryKey: queryKeys.refresh,
    queryFn: UserQuery.userRefresh,
  }),
  create: () => ({
    queryKey: queryKeys.update,
    queryFn: (params)=>{

    },
  }),
  get: ( page: number, size?: number ) => ({
    queryKey: queryKeys.update,
    queryFn: (params)=>{

    },
  }),
  filter: ( page: number, size?: number ) => ({
    queryKey: queryKeys.filter(page, size),
    queryFn: (params)=>{
      return UserQuery.filterUserList({ params, page, size  })
    },
  }),
  update: (id) => ({
    queryKey: queryKeys.update,
    queryFn: (params)=> Comm_Query.updateData({params, id}),
  }),
  delete: ( id ) => ({
    queryKey: queryKeys.update,
    queryFn: (params)=>{

    },
  }),
  deletes: ( ) => ({
    queryKey: queryKeys.update,
    queryFn: (params)=>{

    },
  }),
};


export default queryOptions;