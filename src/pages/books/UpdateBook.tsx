
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getBookById, updateBook, searchBooks } from "@/lib/utils";
import { Pencil, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Book } from "@/types";

// Form validation schema
const formSchema = z.object({
  type: z.enum(["book", "movie"]),
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  available: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateBook() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  
  // Categories list
  const categories = ["Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Drama", "Romance", "Mystery", "Biography"];
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "book",
      title: "",
      author: "",
      serialNumber: "",
      category: "",
      available: true,
    },
  });

  // Load book data when component mounts or bookId changes
  useEffect(() => {
    if (bookId) {
      const bookData = getBookById(bookId);
      if (bookData) {
        setBook(bookData);
        // Set form values
        form.reset({
          type: bookData.type,
          title: bookData.title,
          author: bookData.author,
          serialNumber: bookData.serialNumber,
          category: bookData.category,
          available: bookData.available,
        });
      } else {
        toast({
          title: "Book Not Found",
          description: "The requested book could not be found",
          variant: "destructive",
        });
        navigate("/books/search");
      }
    } else {
      // No book ID provided, redirect to search
      navigate("/books/search");
    }
  }, [bookId, form, navigate]);

  // Form submission handler
  function onSubmit(data: FormValues) {
    if (!bookId) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedBook = updateBook(bookId, {
        type: data.type,
        title: data.title,
        author: data.author,
        serialNumber: data.serialNumber,
        category: data.category,
        available: data.available
      });
      
      if (updatedBook) {
        toast({
          title: "Book Updated",
          description: `"${updatedBook.title}" has been updated successfully`,
        });
        
        // Navigate back to search
        navigate("/books/search");
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update the book. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!book) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          Loading book information...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader 
        heading="Update Book"
        subheading="Edit book or movie information"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Book Type Selection */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="book" id="book" />
                          <FormLabel htmlFor="book" className="font-normal cursor-pointer">
                            Book
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="movie" id="movie" />
                          <FormLabel htmlFor="movie" className="font-normal cursor-pointer">
                            Movie
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Title Input */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Author Input */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author / Director</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={form.watch("type") === "book" ? "Enter author name" : "Enter director name"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Serial Number Input */}
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter serial number (e.g., BK001)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Available Checkbox */}
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Available for issue
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
