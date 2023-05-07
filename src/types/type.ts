export interface BookType {
  id: number
  pid: number
  name: string
  deepest: false
}
export interface BookDetail {
  bookId: number
  bookIsbn: string
  bookName: string
  bookAuthor: string
  bookPublisher: string
  bookSummary: string
  bookCover: string
  bookPrice: number
  bookStock: number
  bookCategoryName: string
  bookLocation: string
  // situation: boolean
}
export interface BookModify {
  id: number
  name: string
  author: string
  type: string
  isbn: string
  info: string
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

export interface UserDetail {
  accountName: number
  accountPassword: string
  accountType: string
}

export interface UserTypeResponse {
  status: boolean
  op: string
  msg: {
    code: string
    content: string
  }
  accounts: UserDetail[]
}
export interface BookTypeResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
  pagenum: number
  numEachPage: number
  categories: BookType[]
}
export interface BackendResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
}
export interface PictureResponse {
  status: boolean
  op: string
  msg: string
  data: string
  name: string
}
export interface LogInfo {
  id: string
  operator: string
  type: string
  time: string
}
