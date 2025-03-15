import FilesQuery from '~/api/_files/queries';

const name= 'files';
const Query= new FilesQuery(name)
const queryKeys = {
  upload: () => [`${name}-upload`] as const,
  update: () => [`${name}-update`] as const,
  delete: () => [`${name}-delete`] as const,
  deletes: () => [`${name}-deletes`] as const,
  // detail: (photoId: number) => [...queryKeys.all, photoId] as const,
  // detailComments: (photoId: number) => [...queryKeys.detail(photoId), 'comments'] as const,
  // detailComment: ({photoId, commentId}: {photoId: number, commentId: number}) => [...queryKeys.detailComments(photoId), commentId] as const,
};


const queryFiles = {
  name: name,
  upload: () => ({
    queryKey: queryKeys.upload,
    queryFn: async (params)=> await Query.uploadFiles(params),
  }),
  update: () => ({
    queryKey: queryKeys.update,
    queryFn: async (params)=> await Query.updateFiles(params),
  }),
  delete: () => ({
    queryKey: queryKeys.delete,
    queryFn: async (params)=> await Query.deleteFiles(params),
  }),
  deletes: () => ({
    queryKey: queryKeys.deletes,
    queryFn: async (params)=> await Query.deletesFiles(params),
  }),
};


export default queryFiles;