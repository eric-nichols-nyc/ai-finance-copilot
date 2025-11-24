import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Settings,
  CreditCard,
  Target,
  DollarSign,
  PieChart,
  Repeat,
  Search,
  ChevronRight,
  HelpCircle,
  Compass,
  ExternalLink,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SettingsButton } from "@/components/SettingsButton";
import { Providers } from "@/app/providers";
import { SidebarAccounts } from "@/components/sidebar-accounts";
import { AIChatPanel } from "@/components/ai-chat-panel";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
    badge: 4,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    title: "Cash flow",
    href: "/cash-flow",
    icon: DollarSign,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Wallet,
  },
  {
    title: "Investments",
    href: "/investments",
    icon: TrendingUp,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: PieChart,
  },
  {
    title: "Recurrings",
    href: "/recurrings",
    icon: Repeat,
  },
];

const bottomItems = [
  {
    title: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    title: "Get help",
    href: "/help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <Providers>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 h-9 bg-sidebar-accent/50"
              />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto h-5 px-1.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Dynamic accounts loaded from database */}
            <SidebarAccounts />

            <div className="mt-auto">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {bottomItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        {item.title === "Settings" ? (
                          <SettingsButton userEmail={user.email} />
                        ) : (
                          <SidebarMenuButton asChild>
                            <Link href={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                You are in demo mode
              </span>
              <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-semibold">AI Finance Manager</h1>
              <div className="flex items-center gap-2">
                <AIChatPanel />

                <ThemeSwitcher />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}
