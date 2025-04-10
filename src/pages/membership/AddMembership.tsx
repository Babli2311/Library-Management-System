
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { addMember, calculateMembershipEndDate } from "@/lib/utils";
import { UserPlus } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  membershipNumber: z.string().min(1, { message: "Membership number is required" }),
  membershipType: z.enum(["6months", "1year", "2years"])
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMembership() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipNumber: "",
      membershipType: "6months"
    },
  });

  // Form submission handler
  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      const startDate = new Date();
      const endDate = calculateMembershipEndDate(startDate, data.membershipType);
      
      const newMember = addMember({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        membershipNumber: data.membershipNumber,
        membershipStartDate: startDate.toISOString(),
        membershipEndDate: endDate.toISOString(),
        membershipType: data.membershipType,
        active: true
      });
      
      toast({
        title: "Membership Added",
        description: `Membership for ${newMember.name} has been created successfully`,
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <PageHeader 
        heading="Add Membership"
        subheading="Create a new membership for the library"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Input */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Phone Input */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Address Input */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Membership Number Input */}
              <FormField
                control={form.control}
                name="membershipNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter membership number (e.g., MEM003)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Membership Type Selection */}
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Membership Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="6months" id="6months" />
                          <FormLabel htmlFor="6months" className="font-normal cursor-pointer">
                            6 Months
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1year" id="1year" />
                          <FormLabel htmlFor="1year" className="font-normal cursor-pointer">
                            1 Year
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2years" id="2years" />
                          <FormLabel htmlFor="2years" className="font-normal cursor-pointer">
                            2 Years
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
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
                <UserPlus className="mr-2 h-4 w-4" />
                Add Membership
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
