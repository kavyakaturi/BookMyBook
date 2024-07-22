import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookserviceService {

  constructor(private http : HttpClient ) { }

  getBooks(){
    return this.http.get<Response<Book[]>>("http://localhost:8800/api/books/books");
  }
}


export type Book =  {
  _id: string
  title: string
  isbn13: string
  price: string
  image: string
  url: string
  __v: number
}

export type Response<T> = {
  sucess: boolean;
  status : number;
  message : String;
  data: T
}