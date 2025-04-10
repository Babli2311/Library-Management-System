
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Book {
  id: string;
  type: "book" | "movie";
  title: string;
  author: string;
  serialNumber: string;
  category: string;
  available: boolean;
  addedDate: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  returnDate: string;
  remarks?: string;
  returned: boolean;
  actualReturnDate?: string;
  fineAmount?: number;
  finePaid?: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipNumber: string;
  membershipStartDate: string;
  membershipEndDate: string;
  membershipType: "6months" | "1year" | "2years";
  active: boolean;
}

export interface SearchParams {
  title?: string;
  author?: string;
  category?: string;
}
