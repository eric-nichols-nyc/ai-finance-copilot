'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

type Recurring = {
  id: string
  name: string
  amount: number
  frequency: string
  nextDueDate: Date
  accountId: string
  categoryId: string
  category: {
    id: string
    name: string
    type: string
  }
}

type RecurringsAccordionProps = {
  recurrings: Recurring[]
  onRecurringSelect: (recurringId: string) => void
  selectedRecurringId?: string
}

export function RecurringsAccordion({
  recurrings,
  onRecurringSelect,
  selectedRecurringId,
}: RecurringsAccordionProps) {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Group recurrings by time period
  const thisMonth = recurrings.filter((r) => {
    const dueDate = new Date(r.nextDueDate)
    return dueDate >= startOfMonth && dueDate <= endOfMonth
  })

  const inTheFuture = recurrings.filter((r) => {
    const dueDate = new Date(r.nextDueDate)
    return dueDate > endOfMonth
  })

  // Helper to format category badge
  const getCategoryColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      SUBSCRIPTIONS: 'bg-purple-500 hover:bg-purple-600',
      RENT: 'bg-orange-500 hover:bg-orange-600',
      CAR: 'bg-blue-500 hover:bg-blue-600',
      UTILITIES: 'bg-amber-500 hover:bg-amber-600',
      SHOPS: 'bg-pink-500 hover:bg-pink-600',
      OTHER: 'bg-gray-500 hover:bg-gray-600',
    }
    return colorMap[type.toUpperCase()] || 'bg-gray-500 hover:bg-gray-600'
  }

  const getCategoryIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      SUBSCRIPTIONS: '🎵',
      RENT: '🏠',
      CAR: '🚗',
      UTILITIES: '💡',
      SHOPS: '🛍️',
      OTHER: '📦',
    }
    return iconMap[type.toUpperCase()] || '📦'
  }

  const RecurringItem = ({ recurring }: { recurring: Recurring }) => {
    const isSelected = selectedRecurringId === recurring.id
    const dueDate = new Date(recurring.nextDueDate)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
      <div
        key={recurring.id}
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-accent' : 'hover:bg-accent/50'
        }`}
        onClick={() => onRecurringSelect(recurring.id)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="text-center min-w-[50px]">
            <p className="text-xs text-muted-foreground">
              {monthNames[dueDate.getMonth()]} {dueDate.getDate()}
              {dueDate.getDate() === 1 ? 'st' : dueDate.getDate() === 2 ? 'nd' : dueDate.getDate() === 3 ? 'rd' : 'th'}
            </p>
          </div>
          <div className="text-2xl">{getCategoryIcon(recurring.category.type)}</div>
          <div className="flex-1">
            <p className="font-medium">{recurring.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{recurring.frequency}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getCategoryColor(recurring.category.type)} text-white text-xs`}>
            {recurring.category.name.toUpperCase()}
          </Badge>
          <div className="text-right min-w-[100px]">
            <p className="font-bold">
              ${recurring.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    )
  }

  const groups = [
    { title: 'This month', items: thisMonth, defaultOpen: true },
    { title: 'In the future', items: inTheFuture, defaultOpen: false },
  ].filter(group => group.items.length > 0)

  const defaultValues = groups.filter(g => g.defaultOpen).map(g => g.title)

  return (
    <Card>
      <CardContent className="pt-6">
        <Accordion type="multiple" defaultValue={defaultValues} className="w-full">
          {groups.map((group) => (
            <AccordionItem key={group.title} value={group.title}>
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{group.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {group.items.length} {group.items.length === 1 ? 'recurring' : 'recurrings'}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {group.items.map((recurring) => (
                    <RecurringItem key={recurring.id} recurring={recurring} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
