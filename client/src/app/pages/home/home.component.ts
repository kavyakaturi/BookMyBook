import { Component, OnInit } from '@angular/core';
import { Book, BookserviceService } from 'src/app/services/bookservice.service';
import { BookCardComponent } from 'src/app/components/book-card/book-card.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  books: Book[] = [];

  constructor(private bookService: BookserviceService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getBooks()
      .subscribe({
        next: (res: any) => {
          this.books = res.data; 
        },
        error: (err: any) => {
          console.error('Error fetching books:', err);
        }
      });
  }
}