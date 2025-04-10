
import { Book, BookIssue, Member, User } from "@/types";
import { addDays } from "date-fns";

// Mock users
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@library.com",
    role: "admin"
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@library.com",
    role: "user"
  }
];

// Mock books
export const books: Book[] = [
  {
    id: "1",
    type: "book",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    serialNumber: "BK001",
    category: "Fiction",
    available: true,
    addedDate: new Date().toISOString()
  },
  {
    id: "2",
    type: "book",
    title: "1984",
    author: "George Orwell",
    serialNumber: "BK002",
    category: "Science Fiction",
    available: false,
    addedDate: new Date().toISOString()
  },
  {
    id: "3",
    type: "movie",
    title: "The Shawshank Redemption",
    author: "Frank Darabont",
    serialNumber: "MV001",
    category: "Drama",
    available: true,
    addedDate: new Date().toISOString()
  },
  {
    id: "4",
    type: "book",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    serialNumber: "BK003",
    category: "Romance",
    available: true,
    addedDate: new Date().toISOString()
  },
  {
    id: "5",
    type: "book",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    serialNumber: "BK004",
    category: "Fiction",
    available: true,
    addedDate: new Date().toISOString()
  }
];

// Mock members
export const members: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown",
    membershipNumber: "MEM001",
    membershipStartDate: new Date().toISOString(),
    membershipEndDate: addDays(new Date(), 180).toISOString(),
    membershipType: "6months",
    active: true
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    address: "456 Oak St, Somewhere",
    membershipNumber: "MEM002",
    membershipStartDate: new Date().toISOString(),
    membershipEndDate: addDays(new Date(), 365).toISOString(),
    membershipType: "1year",
    active: true
  }
];

// Mock book issues
export const bookIssues: BookIssue[] = [
  {
    id: "1",
    bookId: "2",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    memberId: "1",
    memberName: "John Doe",
    issueDate: new Date().toISOString(),
    returnDate: addDays(new Date(), 15).toISOString(),
    remarks: "First edition",
    returned: false
  }
];
