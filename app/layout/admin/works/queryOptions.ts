// import { apiUrl } from '~/store/comm_store.svelte';
import CommQuery, { getQueryKey, getQueryOptions } from '~/api/_comm/queries';
import { type WorksList as List } from './@type'

const name= 'works';
const Query= new CommQuery<List>(name)

const queryKeys = getQueryKey(name)
const queryOptions= getQueryOptions(name, queryKeys, Query)

export { name, queryOptions }