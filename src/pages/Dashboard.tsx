
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/use-auth";
import { books, bookIssues, members } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Clock, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.available).length;
  const totalMembers = members.length;
  const activeIssues = bookIssues.filter(issue => !issue.returned).length;
  
  const recentIssues = bookIssues
    .filter(issue => !issue.returned)
    .slice(0, 5);

  return (
    <PageLayout>
      <PageHeader 
        heading={`Welcome, ${user?.name}!`}
        subheading="Here's an overview of your library system"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {availableBooks} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              All with active memberships
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIssues}</div>
            <p className="text-xs text-muted-foreground">
              Currently checked out
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-4">Recent Book Issues</h2>
        {recentIssues.length > 0 ? (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Book Title</th>
                    <th className="px-4 py-3 text-left font-medium">Member</th>
                    <th className="px-4 py-3 text-left font-medium">Issue Date</th>
                    <th className="px-4 py-3 text-left font-medium">Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue) => (
                    <tr key={issue.id} className="border-t">
                      <td className="px-4 py-3">{issue.bookTitle}</td>
                      <td className="px-4 py-3">{issue.memberName}</td>
                      <td className="px-4 py-3">{formatDate(issue.issueDate)}</td>
                      <td className="px-4 py-3">{formatDate(issue.returnDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-md border bg-muted/20 p-8 text-center">
            <p className="text-muted-foreground">No recent book issues</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
