
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
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
import { addBook } from "@/lib/utils";
import { BookPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form validation schema
const formSchema = z.object({
  type: z.enum(["book", "movie"]),
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  category: z.string().min(1, { message: "Category is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddBook() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    },
  });

  // Form submission handler
  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Add the book to the library
      const newBook = addBook({
        ...data,
        available: true
      });
      
      toast({
        title: "Book Added",
        description: `"${newBook.title}" has been added to the library`,
      });
      
      // Reset the form
      form.reset();
      
      // Optionally navigate to the book search page
      // navigate("/books/search");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <PageHeader 
        heading="Add Book"
        subheading="Add a new book or movie to the library"
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
                        defaultValue={field.value}
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
                      defaultValue={field.value}
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
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                disabled={isSubmitting}
              >
                <BookPlus className="mr-2 h-4 w-4" />
                Add to Library
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
