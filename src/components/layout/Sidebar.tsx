
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  Book, 
  BookCopy, 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  Home, 
  Settings, 
  SquareUser, 
  UserCog, 
  Users 
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <nav className={cn(
      "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground px-3 pb-10",
      className
    )}>
      <div className="flex-1 py-8">
        <div className="px-3 mb-8">
          <h2 className="mb-2 text-lg font-medium">
            Library System
          </h2>
          <p className="text-sm text-sidebar-foreground/60">
            Manage your books and more
          </p>
        </div>
        <div className="space-y-1">
          <NavItem href="/" icon={<Home size={18} />}>
            Dashboard
          </NavItem>
          
          <div className="py-2">
            <div className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/60">
              Transactions
            </div>
            <NavItem href="/books/search" icon={<BookOpen size={18} />}>
              Books Available
            </NavItem>
            <NavItem href="/books/issue" icon={<Book size={18} />}>
              Issue Book
            </NavItem>
            <NavItem href="/books/return" icon={<BookCopy size={18} />}>
              Return Book
            </NavItem>
          </div>

          {isAdmin && (
            <div className="py-2">
              <div className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/60">
                Maintenance
              </div>
              <NavItem href="/membership/add" icon={<Users size={18} />}>
                Add Membership
              </NavItem>
              <NavItem href="/membership/update" icon={<Calendar size={18} />}>
                Update Membership
              </NavItem>
              <NavItem href="/books/add" icon={<Book size={18} />}>
                Add Book
              </NavItem>
              <NavItem href="/books/update" icon={<BookCopy size={18} />}>
                Update Book
              </NavItem>
              <NavItem href="/users/manage" icon={<UserCog size={18} />}>
                User Management
              </NavItem>
            </div>
          )}

          <div className="py-2">
            <div className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/60">
              Reports
            </div>
            <NavItem href="/reports/books" icon={<Book size={18} />}>
              Books Report
            </NavItem>
            <NavItem href="/reports/members" icon={<SquareUser size={18} />}>
              Members Report
            </NavItem>
          </div>
        </div>
      </div>
      
      <div className="mt-auto space-y-1">
        <NavItem href="/help" icon={<HelpCircle size={18} />}>
          Help
        </NavItem>
        <NavItem href="/settings" icon={<Settings size={18} />}>
          Settings
        </NavItem>
      </div>
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

function NavItem({ href, icon, children, disabled = false }: NavItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}
