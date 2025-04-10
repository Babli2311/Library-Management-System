
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getBookById, 
  getBookByTitle, 
  getMemberByNumber, 
  issueBook 
} from "@/lib/utils";
import { Book, Member } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { members } from "@/lib/mock-data";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Check, Loader2 } from "lucide-react";

export default function IssueBook() {
  const [searchParams] = useSearchParams();
  const bookIdFromUrl = searchParams.get("bookId");
  
  const [bookTitle, setBookTitle] = useState("");
  const [bookData, setBookData] = useState<Book | null>(null);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [issueDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 15));
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load book if ID is provided in URL
  useEffect(() => {
    if (bookIdFromUrl) {
      const book = getBookById(bookIdFromUrl);
      if (book) {
        setBookTitle(book.title);
        setBookData(book);
      }
    }
  }, [bookIdFromUrl]);

  // Look up book when title changes
  function handleBookTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setBookTitle(title);
    setBookData(null);
  }

  function handleBookLookup() {
    if (!bookTitle.trim()) {
      toast({
        title: "Book Title Required",
        description: "Please enter a book title",
        variant: "destructive",
      });
      return;
    }

    const book = getBookByTitle(bookTitle);
    if (!book) {
      toast({
        title: "Book Not Found",
        description: "No book found with that title",
        variant: "destructive",
      });
      return;
    }

    if (!book.available) {
      toast({
        title: "Book Not Available",
        description: "This book is currently issued to another member",
        variant: "destructive",
      });
      return;
    }

    setBookData(book);
    toast({
      title: "Book Found",
      description: "Book details loaded successfully",
    });
  }

  // Handle member selection
  function handleMemberSelect(value: string) {
    setMembershipNumber(value);
    const member = getMemberByNumber(value);
    setMemberData(member || null);
  }

  // Validate and issue book
  async function handleIssueBook() {
    if (!bookData) {
      toast({
        title: "Book Required",
        description: "Please select a valid book",
        variant: "destructive",
      });
      return;
    }

    if (!memberData) {
      toast({
        title: "Member Required",
        description: "Please select a valid member",
        variant: "destructive",
      });
      return;
    }

    // Validate return date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxReturnDate = addDays(today, 15);
    
    if (returnDate < today) {
      toast({
        title: "Invalid Return Date",
        description: "Return date cannot be before today",
        variant: "destructive",
      });
      return;
    }

    if (returnDate > maxReturnDate) {
      toast({
        title: "Invalid Return Date",
        description: "Return date cannot be more than 15 days ahead",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const issue = issueBook(bookData.id, memberData.id, returnDate, remarks);
    
    setLoading(false);
    
    if (issue) {
      toast({
        title: "Book Issued Successfully",
        description: `${bookData.title} has been issued to ${memberData.name}`,
      });
      navigate("/");
    }
  }

  return (
    <PageLayout>
      <PageHeader 
        heading="Issue Book"
        subheading="Issue a book to a library member"
      />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="book-title" className="form-required">Book Title</Label>
              <div className="flex gap-2">
                <Input
                  id="book-title"
                  placeholder="Enter book title"
                  value={bookTitle}
                  onChange={handleBookTitleChange}
                  className="flex-1"
                />
                <Button type="button" onClick={handleBookLookup} variant="secondary">
                  Look Up
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={bookData?.author || ""}
                readOnly
                disabled
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member" className="form-required">Member</Label>
              <Select value={membershipNumber} onValueChange={handleMemberSelect}>
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.membershipNumber}>
                      {member.name} ({member.membershipNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="issue-date" className="form-required">Issue Date</Label>
                <Input
                  id="issue-date"
                  value={format(issueDate, "MMM dd, yyyy")}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="return-date" className="form-required">Return Date</Label>
                <DatePicker 
                  date={returnDate} 
                  setDate={setReturnDate} 
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 15)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Optional remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleIssueBook} 
              disabled={!bookData || !memberData || loading}
              className="mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Issue Book
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
