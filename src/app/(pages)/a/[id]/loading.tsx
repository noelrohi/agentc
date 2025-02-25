import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="container mx-auto py-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-[300px]" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-6 w-[500px]" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>

      <Separator className="my-8" />

      {/* Main Content */}
      <div className="space-y-12">
        {/* Metadata Section */}
        <section className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </section>

        {/* Demo Video Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="grid gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </section>
      </div>

      <Separator className="my-8" />

      {/* Footer Navigation */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </main>
  );
}
