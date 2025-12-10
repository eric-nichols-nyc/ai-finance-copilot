'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { createTransaction } from '@/actions/create-transaction'
import { getCategories } from '@/actions/get-categories'
import {
  createTransactionSchema,
  type CreateTransactionInput,
} from '@/lib/validations/transaction'
import { cn } from '@/lib/utils'

type Category = {
  id: string
  name: string
  color: string | null
  icon: string | null
}

type AddTransactionModalProps = {
  accountId: string
  accountName: string
  accountType: string
  currentBalance: number
  children?: React.ReactNode
}

export function AddTransactionModal({
  accountId,
  accountName,
  accountType,
  currentBalance,
  children,
}: AddTransactionModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema) as any,
    defaultValues: {
      accountId,
      amount: 0,
      description: '',
      date: new Date(),
      type: 'EXPENSE',
      notes: '',
      isRecurring: false,
      categoryId: null,
      recurringId: null,
    },
  })

  // Load categories when modal opens
  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const result = await getCategories()
      if (result.success) {
        setCategories(result.categories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const watchedAmount = form.watch('amount')
  const watchedType = form.watch('type')

  // Calculate balance preview
  const calculateBalancePreview = () => {
    const amount = Number(watchedAmount) || 0
    if (amount === 0) return currentBalance

    let balanceChange = 0

    if (accountType === 'CREDIT_CARD' || accountType === 'LOAN') {
      // For credit cards and loans:
      // - EXPENSE/INTEREST_CHARGE increases balance (you owe more)
      // - INCOME/LOAN_PAYMENT decreases balance (you pay off debt)
      if (watchedType === 'EXPENSE' || watchedType === 'INTEREST_CHARGE') {
        balanceChange = amount
      } else if (watchedType === 'INCOME' || watchedType === 'LOAN_PAYMENT') {
        balanceChange = -amount
      }
    } else {
      // For checking and savings:
      // - INCOME increases balance
      // - EXPENSE decreases balance
      if (watchedType === 'INCOME') {
        balanceChange = amount
      } else if (watchedType === 'EXPENSE') {
        balanceChange = -amount
      }
    }

    return currentBalance + balanceChange
  }

  const balancePreview = calculateBalancePreview()

  const onSubmit = async (data: CreateTransactionInput) => {
    setIsSubmitting(true)

    try {
      const result = await createTransaction(data)

      if (result.success) {
        toast.success('Transaction created successfully!', {
          description: `${data.description || 'Transaction'} has been added.`,
        })
        form.reset({
          accountId,
          amount: 0,
          description: '',
          date: new Date(),
          type: 'EXPENSE',
          notes: '',
          isRecurring: false,
          categoryId: null,
          recurringId: null,
        })
        setOpen(false)
      } else {
        toast.error('Failed to create transaction', {
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
      console.error('Error creating transaction:', error)
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction to {accountName}
          </DialogDescription>
        </DialogHeader>

        {/* Balance Preview */}
        {watchedAmount > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Balance Preview</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">
                ${currentBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <span className="text-muted-foreground">→</span>
              <p className="text-lg font-bold text-primary">
                ${balancePreview.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
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
                    Enter the transaction amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                      <SelectItem value="INTEREST_CHARGE">Interest Charge</SelectItem>
                      <SelectItem value="LOAN_PAYMENT">Loan Payment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Grocery shopping, Gas station"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date of the transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorize this transaction {isLoadingCategories && '(Loading...)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes about this transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Recurring */}
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Recurring Transaction
                    </FormLabel>
                    <FormDescription>
                      Mark this as a recurring transaction (e.g., subscription)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

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
                {isSubmitting ? 'Creating...' : 'Create Transaction'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
