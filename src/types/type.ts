export interface BookDetail {
  name: string
  author: string
  isbn: string
  info: string
  situation: boolean
  picAdd: string
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
