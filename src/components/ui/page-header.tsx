
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  subheading,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">{heading}</h1>
          {subheading && (
            <p className="text-muted-foreground">{subheading}</p>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
