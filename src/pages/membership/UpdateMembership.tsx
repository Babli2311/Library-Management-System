
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getMemberByNumber, updateMember, calculateMembershipEndDate } from "@/lib/utils";
import { UserCheck, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Member } from "@/types";
import { addDays } from "date-fns";

// Form validation schema
const formSchema = z.object({
  membershipNumber: z.string().min(1, { message: "Membership number is required" }),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  membershipType: z.enum(["6months", "1year", "2years"]),
  cancelMembership: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateMembership() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membershipNumber: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipType: "6months",
      cancelMembership: false
    },
  });

  // Search for member by membership number
  const searchMember = () => {
    const membershipNumber = form.getValues("membershipNumber");
    
    if (!membershipNumber) {
      toast({
        title: "Error",
        description: "Please enter a membership number",
        variant: "destructive",
      });
      return;
    }
    
    const member = getMemberByNumber(membershipNumber);
    setSearchPerformed(true);
    
    if (!member) {
      setFoundMember(null);
      toast({
        title: "Not Found",
        description: "No member found with this membership number",
        variant: "destructive",
      });
      return;
    }
    
    setFoundMember(member);
    
    // Update form with member data
    form.setValue("name", member.name);
    form.setValue("email", member.email);
    form.setValue("phone", member.phone);
    form.setValue("address", member.address);
    form.setValue("membershipType", member.membershipType);
  };

  // Form submission handler
  function onSubmit(data: FormValues) {
    if (!foundMember) {
      toast({
        title: "Error",
        description: "Please search for a valid membership first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let updatedMemberData: Partial<Member> = {};
      
      if (data.cancelMembership) {
        // Cancel membership
        updatedMemberData = {
          active: false
        };
      } else {
        // Extend membership
        const currentEndDate = new Date(foundMember.membershipEndDate);
        const newEndDate = calculateMembershipEndDate(currentEndDate, data.membershipType);
        
        updatedMemberData = {
          membershipType: data.membershipType,
          membershipEndDate: newEndDate.toISOString()
        };
      }
      
      const updatedMember = updateMember(foundMember.id, updatedMemberData);
      
      if (updatedMember) {
        toast({
          title: data.cancelMembership ? "Membership Cancelled" : "Membership Updated",
          description: data.cancelMembership 
            ? `Membership for ${updatedMember.name} has been cancelled` 
            : `Membership for ${updatedMember.name} has been extended`,
        });
        
        // Reset the form and search state
        form.reset();
        setFoundMember(null);
        setSearchPerformed(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <PageHeader 
        heading="Update Membership"
        subheading="Extend or cancel an existing membership"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <div className="space-y-6">
              {/* Membership Number and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="membershipNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Membership Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter membership number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={searchMember}
                  className="mb-[2px]"
                >
                  Search
                </Button>
              </div>
              
              {searchPerformed && !foundMember && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                  <AlertCircle className="text-amber-500 mr-2 h-5 w-5 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Member not found</h3>
                    <p className="text-amber-700 text-sm">
                      No member with this membership number was found. Please check the number and try again.
                    </p>
                  </div>
                </div>
              )}

              {foundMember && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Member Information Display */}
                  <div className="bg-muted/50 p-4 rounded-md space-y-2">
                    <h3 className="font-medium">Member Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {foundMember.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {foundMember.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {foundMember.phone}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> 
                        <span className={foundMember.active ? "text-green-600" : "text-red-600"}>
                          {foundMember.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Start Date:</span> {formatDate(foundMember.membershipStartDate)}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span> {formatDate(foundMember.membershipEndDate)}
                      </div>
                      <div>
                        <span className="font-medium">Current Plan:</span> 
                        {foundMember.membershipType === "6months" && "6 Months"}
                        {foundMember.membershipType === "1year" && "1 Year"}
                        {foundMember.membershipType === "2years" && "2 Years"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Cancel Membership Checkbox */}
                  <FormField
                    control={form.control}
                    name="cancelMembership"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Cancel Membership</FormLabel>
                          <FormDescription>
                            Check this box if you want to cancel the membership instead of extending it.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {/* Membership Type Selection - Only shown if not cancelling */}
                  {!form.watch("cancelMembership") && (
                    <FormField
                      control={form.control}
                      name="membershipType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Extend Membership By</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="6months" id="extend-6months" />
                                <FormLabel htmlFor="extend-6months" className="font-normal cursor-pointer">
                                  6 Months
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1year" id="extend-1year" />
                                <FormLabel htmlFor="extend-1year" className="font-normal cursor-pointer">
                                  1 Year
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2years" id="extend-2years" />
                                <FormLabel htmlFor="extend-2years" className="font-normal cursor-pointer">
                                  2 Years
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto" 
                    disabled={isSubmitting}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    {form.watch("cancelMembership") ? "Cancel Membership" : "Update Membership"}
                  </Button>
                </form>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
