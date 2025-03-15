export interface FilesUpload {
  id: Number
  status: string
}

export interface FilesResponse<T> {
  response: Response
  data: T
}