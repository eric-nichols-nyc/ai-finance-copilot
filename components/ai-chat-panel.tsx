'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { MessageSquare, Sparkles } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AIChatPanel() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      api: '/api/chat',
    })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open AI Chat"
        >
          <MessageSquare className="h-5 w-5" />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-blue-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[540px] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Financial Copilot
          </SheetTitle>
          <SheetDescription>
            Ask me anything about your finances, budgets, or transactions
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Ask me about your spending, budgets, or any financial questions"
              icon={<MessageSquare className="h-12 w-12" />}
            />
          ) : (
            <Conversation className="flex-1">
              <ConversationContent>
                {messages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.role === 'assistant' ? (
                        <MessageResponse>{message.content}</MessageResponse>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}

          <div className="border-t p-4">
            <PromptInput
              onSubmit={(message, event) => {
                event.preventDefault()
                if (status === 'streaming') {
                  stop()
                } else {
                  handleSubmit(event as any)
                }
              }}
            >
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about your finances..."
                  className="resize-none"
                />
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit status={status} />
                </PromptInputFooter>
              </PromptInputBody>
            </PromptInput>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
