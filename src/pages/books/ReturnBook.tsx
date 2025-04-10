
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  getBookByTitle, 
  getActiveBookIssueByBookId,
  returnBook,
  payFine,
  formatDate,
} from "@/lib/utils";
import { BookIssue } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Check, Loader2 } from "lucide-react";

export default function ReturnBook() {
  const [bookTitle, setBookTitle] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookIssue, setBookIssue] = useState<BookIssue | null>(null);
  
  // Fine dialog state
  const [showFineDialog, setShowFineDialog] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);
  const [finePaid, setFinePaid] = useState(false);
  const [processingReturn, setProcessingReturn] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Look up book when title changes
  function handleBookTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setBookTitle(title);
    setAuthorName("");
    setBookIssue(null);
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

    // Find active issue for this book
    const issue = getActiveBookIssueByBookId(book.id);
    if (!issue) {
      toast({
        title: "Not Issued",
        description: "This book is not currently issued to anyone",
        variant: "destructive",
      });
      return;
    }

    setBookIssue(issue);
    setAuthorName(book.author);
    setSerialNumber(book.serialNumber);
    setIssueDate(new Date(issue.issueDate));
    setReturnDate(new Date(issue.returnDate));

    toast({
      title: "Book Found",
      description: "Book details loaded successfully",
    });
  }

  // Validate and return book
  async function handleReturnBook() {
    if (!bookIssue) {
      toast({
        title: "Book Required",
        description: "Please select a valid book",
        variant: "destructive",
      });
      return;
    }

    if (!serialNumber) {
      toast({
        title: "Serial Number Required",
        description: "Please enter the book's serial number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = returnBook(bookIssue.id, returnDate);
    
    setLoading(false);
    
    if (result) {
      setFineAmount(result.fineAmount);
      setShowFineDialog(true);
    }
  }

  async function handlePayFine() {
    if (!bookIssue) return;
    
    setProcessingReturn(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = payFine(bookIssue.id);
    
    setProcessingReturn(false);
    setShowFineDialog(false);
    
    if (result) {
      toast({
        title: "Book Returned Successfully",
        description: `${bookTitle} has been returned to the library`,
      });
      navigate("/");
    }
  }

  return (
    <PageLayout>
      <PageHeader 
        heading="Return Book"
        subheading="Process a book return from a library member"
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
                value={authorName}
                readOnly
                disabled
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serial-number" className="form-required">Serial Number</Label>
              <Input
                id="serial-number"
                placeholder="Enter serial number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input
                  id="issue-date"
                  value={issueDate ? formatDate(issueDate) : ""}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="return-date" className="form-required">Return Date</Label>
                <DatePicker 
                  date={returnDate} 
                  setDate={setReturnDate}
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
            
            {bookIssue && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Returning book</AlertTitle>
                <AlertDescription>
                  This book was issued to {bookIssue.memberName}.
                  Return date was set to {formatDate(bookIssue.returnDate)}.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleReturnBook} 
              disabled={!bookIssue || !serialNumber || loading}
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
                  Confirm Return
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Fine Dialog */}
      <Dialog open={showFineDialog} onOpenChange={setShowFineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Return - Fine Payment</DialogTitle>
            <DialogDescription>
              Please confirm the fine payment details to complete the return process.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Book Title</Label>
              <Input value={bookTitle} readOnly disabled />
            </div>
            
            <div className="grid gap-2">
              <Label>Return Date</Label>
              <Input value={formatDate(returnDate)} readOnly disabled />
            </div>
            
            <div className="grid gap-2">
              <Label>Fine Amount</Label>
              <Input value={`$${fineAmount.toFixed(2)}`} readOnly disabled />
            </div>
            
            {fineAmount > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fine-paid"
                  checked={finePaid}
                  onCheckedChange={(checked) => setFinePaid(checked === true)}
                />
                <Label htmlFor="fine-paid" className="form-required">Fine Paid</Label>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Optional remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowFineDialog(false)}
              disabled={processingReturn}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayFine} 
              disabled={(fineAmount > 0 && !finePaid) || processingReturn}
            >
              {processingReturn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete Return
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
