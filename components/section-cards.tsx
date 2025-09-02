import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
        
        <CardHeader className="relative z-10">
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent @[250px]/card:text-4xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 px-3 py-1.5 rounded-full gap-1.5 backdrop-blur-sm">
              <IconTrendingUp className="h-4 w-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-700 dark:text-slate-300">
            Trending up this month <IconTrendingUp className="size-4 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-rose-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
        
        <CardHeader className="relative z-10">
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">New Customers</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent @[250px]/card:text-4xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-0 px-3 py-1.5 rounded-full gap-1.5 backdrop-blur-sm">
              <IconTrendingDown className="h-4 w-4" />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-700 dark:text-slate-300">
            Down 20% this period <IconTrendingDown className="size-4 text-rose-500 animate-bounce" />
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-violet-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
        
        <CardHeader className="relative z-10">
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Accounts</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent @[250px]/card:text-4xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-0 px-3 py-1.5 rounded-full gap-1.5 backdrop-blur-sm">
              <IconTrendingUp className="h-4 w-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-700 dark:text-slate-300">
            Strong user retention <IconTrendingUp className="size-4 text-violet-500 animate-pulse" />
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            Engagement exceed targets
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
        
        <CardHeader className="relative z-10">
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">Growth Rate</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent @[250px]/card:text-4xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-0 px-3 py-1.5 rounded-full gap-1.5 backdrop-blur-sm">
              <IconTrendingUp className="h-4 w-4" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-700 dark:text-slate-300">
            Steady performance increase <IconTrendingUp className="size-4 text-cyan-500 animate-pulse" />
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            Meets growth projections
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}