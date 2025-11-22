'use client'

import { useState } from 'react'
import { ChevronRight, LogOut, Mail, Trash2, UserX } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { signout } from '@/actions/signout'
import { deleteAccount } from '@/actions/delete-account'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SettingsSheetProps {
  children: React.ReactNode
  userEmail?: string
}

export function SettingsSheet({ children, userEmail }: SettingsSheetProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [budgetingEnabled, setBudgetingEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleLogout = async () => {
    await signout()
  }

  const handleDeleteAccount = async () => {
    await deleteAccount()
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 py-6">
            {/* Features Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budgeting</span>
                  <Switch
                    checked={budgetingEnabled}
                    onCheckedChange={setBudgetingEnabled}
                  />
                </div>
                <button className="flex w-full items-center justify-between text-sm hover:bg-accent hover:text-accent-foreground rounded-md p-2 -mx-2 transition-colors">
                  <span>Tags</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Separator />

            {/* Appearance Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Appearance
              </h3>
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between text-sm hover:bg-accent hover:text-accent-foreground rounded-md p-2 -mx-2 transition-colors">
                  <span>Dark mode</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Automatic</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>

            <Separator />

            {/* Notifications Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget alerts</span>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Big expense alert</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low balance alert</span>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Account
              </h3>
              <div className="space-y-3">
                {userEmail && (
                  <div className="flex items-center gap-3 text-sm py-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{userEmail}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 text-sm hover:bg-accent hover:text-accent-foreground rounded-md p-2 -mx-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex w-full items-center gap-3 text-sm text-destructive hover:bg-destructive/10 rounded-md p-2 -mx-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete your account</span>
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-destructive" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <p className="font-semibold">
                This will permanently delete:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All your transactions</li>
                <li>All your accounts and balances</li>
                <li>All your budgets and categories</li>
                <li>All your recurring charges</li>
                <li>All your personal data</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
