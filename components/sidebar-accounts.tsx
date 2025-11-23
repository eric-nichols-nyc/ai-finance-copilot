'use client'

import Link from 'next/link'
import { CreditCard, Wallet, TrendingUp, ChevronRight } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useAccountsSummary } from '@/hooks/use-accounts'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Client component that fetches and displays real account data in the sidebar.
 * Uses React Query for caching and automatic refetching.
 */
export function SidebarAccounts() {
  const { data, isLoading, error } = useAccountsSummary()

  // Show loading state
  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          MY ACCOUNTS
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="space-y-2 p-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  // Show error state or no data
  if (error || !data?.success) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          MY ACCOUNTS
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <p className="p-4 text-sm text-muted-foreground">
            Unable to load accounts
          </p>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  const accounts = data.data

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
        MY ACCOUNTS
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Credit Cards */}
          {accounts.creditCards.length > 0 && (
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit cards</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="ml-4 mt-1">
                    {accounts.creditCards.map((card) => (
                      <SidebarMenuItem key={card.id}>
                        <SidebarMenuButton asChild size="sm">
                          <Link
                            href={`/accounts?id=${card.id}`}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{card.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ${Math.abs(card.balance).toLocaleString()}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}

          {/* Checking & Savings (Depository) */}
          {(accounts.checking.length > 0 || accounts.savings.length > 0) && (
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <Wallet className="h-4 w-4" />
                    <span>Depository</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="ml-4 mt-1">
                    {accounts.checking.map((account) => (
                      <SidebarMenuItem key={account.id}>
                        <SidebarMenuButton asChild size="sm">
                          <Link
                            href={`/accounts?id=${account.id}`}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{account.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ${account.balance.toLocaleString()}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {accounts.savings.map((account) => (
                      <SidebarMenuItem key={account.id}>
                        <SidebarMenuButton asChild size="sm">
                          <Link
                            href={`/accounts?id=${account.id}`}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{account.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ${account.balance.toLocaleString()}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}

          {/* Investments */}
          {accounts.investments.length > 0 && (
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <TrendingUp className="h-4 w-4" />
                    <span>Investment</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="ml-4 mt-1">
                    {accounts.investments.map((account) => (
                      <SidebarMenuItem key={account.id}>
                        <SidebarMenuButton asChild size="sm">
                          <Link
                            href={`/accounts?id=${account.id}`}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{account.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ${account.balance.toLocaleString()}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}

          {/* Loans */}
          {accounts.loans.length > 0 && (
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <CreditCard className="h-4 w-4" />
                    <span>Loans</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="ml-4 mt-1">
                    {accounts.loans.map((account) => (
                      <SidebarMenuItem key={account.id}>
                        <SidebarMenuButton asChild size="sm">
                          <Link
                            href={`/accounts?id=${account.id}`}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{account.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ${Math.abs(account.balance).toLocaleString()}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
