import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 h-full min-h-[400px] bg-white dark:bg-slate-700/50 p-6 rounded-xl">
      <Skeleton className="h-[200px] w-[250px] rounded-xl bg-neutral-300 dark:bg-slate-600 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 bg-neutral-300 dark:bg-slate-600 w-full" />
        <Skeleton className="h-5 bg-neutral-300 dark:bg-slate-600 w-full" />
      </div>
    </div>
  )
}