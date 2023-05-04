export interface BookDetail {
  id: number
  name: string
  author: string
  publisher: string
  category: string
  stock: number
  price: number
  type: string
  location: string[]
  isbn: string
  summary: string
  // situation: boolean
  cover: string
}
export interface BookModify {
  id: number
  name: string
  author: string
  type:string
  isbn: string
  info: string
  useable: boolean
  inventory: number
  price: number
  picObj: string
  location: string[]
}
export interface BookResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
  books: BookDetail[]
}
export interface BackendResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
}
