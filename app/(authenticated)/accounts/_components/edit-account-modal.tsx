'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateAccount } from '@/actions/update-account'
import { updateAccountSchema, type UpdateAccountInput, AccountType } from '@/lib/validations/account'
import { type Account } from '@/types'

type EditAccountModalProps = {
  account: Account
  children?: React.ReactNode
}

export function EditAccountModal({ account, children }: EditAccountModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prepare default values based on account type
  const getDefaultValues = (): Partial<UpdateAccountInput> => {
    // Cast strict account type to ensure it matches the schema's expected string literals
    const type = account.type as AccountType

    const base = {
      id: account.id,
      name: account.name,
      type: type,
      balance: account.balance,
      currency: 'USD',
    }

    if (type === 'CREDIT_CARD') {
      return {
        ...base,
        type: 'CREDIT_CARD',
        creditLimit: account.creditLimit ?? undefined,
        apr: account.apr ?? undefined,
      }
    }

    if (type === 'LOAN') {
      return {
        ...base,
        type: 'LOAN',
        loanAmount: account.loanAmount ?? undefined,
        remainingBalance: account.remainingBalance ?? undefined,
        loanTerm: account.loanTerm ?? undefined,
        monthlyPayment: account.monthlyPayment ?? undefined,
        apr: account.apr ?? undefined,
      }
    }

    return base as Partial<UpdateAccountInput>
  }

  const form = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema) as any,
    defaultValues: getDefaultValues(),
  })

  // Reset form when modal opens with fresh account data
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues())
    }
  }, [open, account])

  const accountType = form.watch('type')

  const onSubmit = async (data: UpdateAccountInput) => {
    setIsSubmitting(true)

    try {
      const result = await updateAccount(data)

      if (result.success) {
        toast.success('Account updated successfully!', {
          description: `${result.account.name} has been updated.`,
        })
        setOpen(false)
      } else {
        toast.error('Failed to update account', {
          description: result.error,
        })

        // Set field errors if provided
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            form.setError(field as any, {
              message: errors[0],
            })
          })
        }
      }
    } catch (error) {
      console.error('Error updating account:', error)
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate available credit for credit cards
  const availableCredit =
    accountType === 'CREDIT_CARD' && account.creditLimit
      ? account.creditLimit - account.balance
      : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Update account details and balance information.
          </DialogDescription>
        </DialogHeader>

        {/* Current Balance Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold">
            ${account.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          {availableCredit !== null && (
            <p className="text-sm text-muted-foreground">
              Available Credit: ${availableCredit.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chase Checking, Capital One Credit Card"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name to identify this account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Type (Read-only) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select value={field.value} disabled>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHECKING">Checking</SelectItem>
                      <SelectItem value="SAVINGS">Savings</SelectItem>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="LOAN">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Account type cannot be changed after creation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Balance */}
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Update the current balance of this account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Credit Card Specific Fields */}
            {accountType === 'CREDIT_CARD' && (
              <>
                <FormField
                  control={form.control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The maximum credit limit on this card
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APR (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Annual Percentage Rate for this credit card
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Loan Specific Fields */}
            {accountType === 'LOAN' && (
              <>
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Loan Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The original amount borrowed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remainingBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Balance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The current remaining balance on the loan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Term (months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The total term of the loan in months
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Payment</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        The fixed monthly payment amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APR (%) - Optional</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Annual Percentage Rate for this loan (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
