import type { Dayjs } from 'dayjs'

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
  bookCoverName: string
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
  location: String[]
  cover: string
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
  accountName: string
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
export interface BookInfo {
  name: string
  bookId: string
  isbn: string
  author: string
  borrower: string | undefined
  borrowdate: Dayjs | undefined
  duedate: Dayjs | undefined
  returndate: Dayjs | undefined
  status: 'available' | 'borrowed' | 'overdue' | 'returned' | 'renewed'
  renewable: boolean | undefined
  visible: boolean
  borrowId: number | undefined
  fine: Number
}

export interface BorrowRecord {
  bookIsbn: string
  bookName: string
  bookAuthor: string
  borrowAccount: string
  borrowTime: string
  borrowDuration: number
  borrowIsrenew: number
  borrowIsOverTime: number
  borrowId: number
  borrowIsReturn: string | undefined
  borrowReturnDate: string | undefined
}

export interface BorrowResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
  pageNum: number
  numEachPage: number
  infoList: BorrowRecord[]
}

export interface LogDetail {
  opUser: string
  opId: string
  opTime: Dayjs
  opDo: string
  opInfo: string
}

export interface LogResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
  logs: LogDetail[]
}
