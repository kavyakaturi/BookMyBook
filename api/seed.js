import BookJson from './Bookstore.books.json' assert { type: "json"};
import Book from './models/Book.js';

export const seedBooksData = async () => {
  try{
    await Book.deleteMany({});
    await Book.insertMany(BookJson);
    console.log("Data seeded Successfully");
  }catch(error) {
    console.log("Error :", error);
  }
}