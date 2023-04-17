export interface BookDetail {
  id: number
  name: string
  author: string
  isbn: string
  info: string
  situation: boolean
  picAdd: string
}
export interface BookModify {
  id: number
  name: string
  author: string
  isbn: string
  info: string
  useable: boolean
  inventory: number
  picObj: string
}
export interface ApiResponse<T> {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
  data: T
}
