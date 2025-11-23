'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Pencil, CalendarIcon, Trash2 } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { updateTransaction } from '@/actions/update-transaction'
import { deleteTransaction } from '@/actions/delete-transaction'
import { getCategories } from '@/actions/get-categories'
import {
  updateTransactionSchema,
  type UpdateTransactionInput,
} from '@/lib/validations/transaction'
import { cn } from '@/lib/utils'

type Category = {
  id: string
  name: string
  color: string | null
  icon: string | null
}

type Transaction = {
  id: string
  amount: number
  description: string | null
  date: Date
  type: string
  notes: string | null
  isRecurring: boolean
  categoryId: string | null
}

type EditTransactionModalProps = {
  transaction: Transaction
  accountType: string
  currentBalance: number
  onClose?: () => void
  children?: React.ReactNode
}

export function EditTransactionModal({
  transaction,
  accountType,
  currentBalance,
  onClose,
  children,
}: EditTransactionModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  const form = useForm<UpdateTransactionInput>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description || '',
      date: new Date(transaction.date),
      type: transaction.type as any,
      notes: transaction.notes || '',
      isRecurring: transaction.isRecurring,
      categoryId: transaction.categoryId,
    },
  })

  // Load categories when modal opens
  useEffect(() => {
    if (open) {
      loadCategories()
      // Reset form with fresh transaction data
      form.reset({
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description || '',
        date: new Date(transaction.date),
        type: transaction.type as any,
        notes: transaction.notes || '',
        isRecurring: transaction.isRecurring,
        categoryId: transaction.categoryId,
      })
    }
  }, [open, transaction])

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

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const onSubmit = async (data: UpdateTransactionInput) => {
    setIsSubmitting(true)

    try {
      const result = await updateTransaction(data)

      if (result.success) {
        toast.success('Transaction updated successfully!', {
          description: `${data.description || 'Transaction'} has been updated.`,
        })
        handleClose()
      } else {
        toast.error('Failed to update transaction', {
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
      console.error('Error updating transaction:', error)
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteTransaction({ id: transaction.id })

      if (result.success) {
        toast.success('Transaction deleted successfully!')
        setShowDeleteDialog(false)
        handleClose()
      } else {
        toast.error('Failed to delete transaction', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const watchedAmount = form.watch('amount')
  const watchedType = form.watch('type')

  // Calculate balance impact of current transaction
  const calculateOldBalanceImpact = () => {
    const amount = Number(transaction.amount)

    if (accountType === 'CREDIT_CARD' || accountType === 'LOAN') {
      if (
        transaction.type === 'EXPENSE' ||
        transaction.type === 'INTEREST_CHARGE'
      ) {
        return amount
      } else if (
        transaction.type === 'INCOME' ||
        transaction.type === 'LOAN_PAYMENT'
      ) {
        return -amount
      }
    } else {
      if (transaction.type === 'INCOME') {
        return amount
      } else if (transaction.type === 'EXPENSE') {
        return -amount
      }
    }
    return 0
  }

  // Calculate balance impact of updated transaction
  const calculateNewBalanceImpact = () => {
    const amount = Number(watchedAmount) || 0

    if (accountType === 'CREDIT_CARD' || accountType === 'LOAN') {
      if (watchedType === 'EXPENSE' || watchedType === 'INTEREST_CHARGE') {
        return amount
      } else if (watchedType === 'INCOME' || watchedType === 'LOAN_PAYMENT') {
        return -amount
      }
    } else {
      if (watchedType === 'INCOME') {
        return amount
      } else if (watchedType === 'EXPENSE') {
        return -amount
      }
    }
    return 0
  }

  const oldBalanceImpact = calculateOldBalanceImpact()
  const newBalanceImpact = calculateNewBalanceImpact()
  const balancePreview = currentBalance - oldBalanceImpact + newBalanceImpact

  // Calculate what balance would be if transaction is deleted
  const balanceAfterDelete = currentBalance - oldBalanceImpact

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update or delete this transaction
            </DialogDescription>
          </DialogHeader>

          {/* Balance Preview */}
          {(watchedAmount !== transaction.amount || watchedType !== transaction.type) && (
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
                      onValueChange={(value) =>
                        field.onChange(value === 'none' ? null : value)
                      }
                      value={field.value || 'none'}
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
                      Categorize this transaction{' '}
                      {isLoadingCategories && '(Loading...)'}
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
                      <FormLabel>Recurring Transaction</FormLabel>
                      <FormDescription>
                        Mark this as a recurring transaction (e.g., subscription)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isSubmitting || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Transaction
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting || isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isDeleting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction. The account balance will change from:
              <div className="mt-2 flex items-center gap-2 font-semibold">
                <span>
                  ${currentBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span>→</span>
                <span>
                  ${balanceAfterDelete.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
