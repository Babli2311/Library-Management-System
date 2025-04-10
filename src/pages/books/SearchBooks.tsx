
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Book, SearchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { searchBooks } from "@/lib/utils";
import { Book as BookType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function SearchBooks() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [results, setResults] = useState<BookType[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title && !author && !category) {
      toast({
        title: "Search Error",
        description: "Please enter at least one search criteria",
        variant: "destructive",
      });
      return;
    }
    
    const searchResults = searchBooks({
      title: title || undefined,
      author: author || undefined,
      category: category || undefined,
    });
    
    setResults(searchResults);
    setSearchPerformed(true);
    setSelectedBookId(null);
  }

  function handleBookSelect(bookId: string) {
    setSelectedBookId(bookId);
  }

  function handleIssueSelected() {
    if (!selectedBookId) {
      toast({
        title: "Selection Required",
        description: "Please select a book first",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/books/issue?bookId=${selectedBookId}`);
  }

  const categories = ["Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Drama", "Romance", "Mystery", "Biography"];

  return (
    <PageLayout>
      <PageHeader 
        heading="Book Search"
        subheading="Find books available in the library"
      />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="md:col-span-3">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search Books
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {searchPerformed && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Search Results</h2>
            <Button
              onClick={handleIssueSelected}
              disabled={!selectedBookId || !results.find(b => b.id === selectedBookId)?.available}
            >
              <Book className="mr-2 h-4 w-4" />
              Issue Selected Book
            </Button>
          </div>
          
          {results.length > 0 ? (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Title</th>
                      <th className="px-4 py-3 text-left font-medium">Author</th>
                      <th className="px-4 py-3 text-left font-medium">Category</th>
                      <th className="px-4 py-3 text-left font-medium">Type</th>
                      <th className="px-4 py-3 text-left font-medium">Serial Number</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((book) => (
                      <tr key={book.id} className="border-t">
                        <td className="px-4 py-3">{book.title}</td>
                        <td className="px-4 py-3">{book.author}</td>
                        <td className="px-4 py-3">{book.category}</td>
                        <td className="px-4 py-3 capitalize">{book.type}</td>
                        <td className="px-4 py-3">{book.serialNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                            book.available 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {book.available ? "Available" : "Issued"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <RadioGroup
                            value={selectedBookId || ""}
                            onValueChange={handleBookSelect}
                            disabled={!book.available}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={book.id} 
                                id={`book-${book.id}`}
                                disabled={!book.available}
                              />
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-md border bg-muted/20 p-8 text-center">
              <p className="text-muted-foreground">No books found matching your search criteria</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
