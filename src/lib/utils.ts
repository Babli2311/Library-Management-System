
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Book, BookIssue, Member, SearchParams, User } from "@/types";
import { books, bookIssues, members, users } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display
export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM dd, yyyy");
}

// Authentication functions
export function login(email: string, password: string): User | null {
  // In a real app, you would validate against a backend
  // For demo, we'll just check if email exists and accept any password
  return users.find(user => user.email === email) || null;
}

// Books related utility functions
export function searchBooks(params: SearchParams): Book[] {
  return books.filter(book => {
    if (params.title && !book.title.toLowerCase().includes(params.title.toLowerCase())) {
      return false;
    }
    if (params.author && !book.author.toLowerCase().includes(params.author.toLowerCase())) {
      return false;
    }
    if (params.category && book.category !== params.category) {
      return false;
    }
    return true;
  });
}

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

export function getBookByTitle(title: string): Book | undefined {
  return books.find(book => book.title.toLowerCase() === title.toLowerCase());
}

export function addBook(book: Omit<Book, "id" | "addedDate">): Book {
  const newBook: Book = {
    ...book,
    id: `${books.length + 1}`,
    addedDate: new Date().toISOString()
  };
  books.push(newBook);
  return newBook;
}

export function updateBook(id: string, bookData: Partial<Book>): Book | null {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return null;
  
  books[index] = { ...books[index], ...bookData };
  return books[index];
}

// Members related utility functions
export function getMemberById(id: string): Member | undefined {
  return members.find(member => member.id === id);
}

export function getMemberByNumber(membershipNumber: string): Member | undefined {
  return members.find(member => member.membershipNumber === membershipNumber);
}

export function addMember(member: Omit<Member, "id">): Member {
  const newMember: Member = {
    ...member,
    id: `${members.length + 1}`
  };
  members.push(newMember);
  return newMember;
}

export function updateMember(id: string, memberData: Partial<Member>): Member | null {
  const index = members.findIndex(member => member.id === id);
  if (index === -1) return null;
  
  members[index] = { ...members[index], ...memberData };
  return members[index];
}

// Book issues related utility functions
export function issueBook(bookId: string, memberId: string, returnDate: Date, remarks?: string): BookIssue | null {
  const book = getBookById(bookId);
  const member = getMemberById(memberId);
  
  if (!book || !member) {
    toast({
      title: "Error",
      description: "Book or member not found",
      variant: "destructive"
    });
    return null;
  }
  
  if (!book.available) {
    toast({
      title: "Error",
      description: "Book is not available for issue",
      variant: "destructive"
    });
    return null;
  }
  
  const today = new Date();
  
  if (isBefore(returnDate, today)) {
    toast({
      title: "Error",
      description: "Return date cannot be before today",
      variant: "destructive"
    });
    return null;
  }
  
  const defaultReturnDate = addDays(today, 15);
  if (isAfter(returnDate, defaultReturnDate)) {
    toast({
      title: "Error",
      description: "Return date cannot be more than 15 days from today",
      variant: "destructive"
    });
    return null;
  }
  
  const newIssue: BookIssue = {
    id: `${bookIssues.length + 1}`,
    bookId,
    bookTitle: book.title,
    bookAuthor: book.author,
    memberId,
    memberName: member.name,
    issueDate: today.toISOString(),
    returnDate: returnDate.toISOString(),
    remarks,
    returned: false
  };
  
  bookIssues.push(newIssue);
  
  // Update book availability
  updateBook(bookId, { available: false });
  
  return newIssue;
}

export function getBookIssueById(id: string): BookIssue | undefined {
  return bookIssues.find(issue => issue.id === id);
}

export function getActiveBookIssueByBookId(bookId: string): BookIssue | undefined {
  return bookIssues.find(issue => issue.bookId === bookId && !issue.returned);
}

export function returnBook(issueId: string, actualReturnDate: Date): { issue: BookIssue, fineAmount: number } | null {
  const index = bookIssues.findIndex(issue => issue.id === issueId);
  
  if (index === -1) {
    toast({
      title: "Error",
      description: "Book issue record not found",
      variant: "destructive"
    });
    return null;
  }
  
  const issue = bookIssues[index];
  const returnDate = new Date(issue.returnDate);
  let fineAmount = 0;
  
  // Calculate fine if returned after due date
  if (isAfter(actualReturnDate, returnDate)) {
    const daysLate = differenceInDays(actualReturnDate, returnDate);
    fineAmount = daysLate * 10; // $10 per day late
  }
  
  issue.actualReturnDate = actualReturnDate.toISOString();
  issue.fineAmount = fineAmount;
  
  if (fineAmount === 0) {
    // If no fine, mark as returned immediately
    issue.returned = true;
    issue.finePaid = true;
    
    // Make book available again
    const book = getBookById(issue.bookId);
    if (book) {
      updateBook(book.id, { available: true });
    }
  }
  
  return { issue, fineAmount };
}

export function payFine(issueId: string): BookIssue | null {
  const index = bookIssues.findIndex(issue => issue.id === issueId);
  
  if (index === -1) return null;
  
  const issue = bookIssues[index];
  issue.finePaid = true;
  issue.returned = true;
  
  // Make book available again
  const book = getBookById(issue.bookId);
  if (book) {
    updateBook(book.id, { available: true });
  }
  
  return issue;
}

// Calculate membership end date based on type
export function calculateMembershipEndDate(startDate: Date, type: "6months" | "1year" | "2years"): Date {
  switch (type) {
    case "6months":
      return addDays(startDate, 180);
    case "1year":
      return addDays(startDate, 365);
    case "2years":
      return addDays(startDate, 730);
  }
}
