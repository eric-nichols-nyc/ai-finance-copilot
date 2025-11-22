import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Example component tests
 * These demonstrate how to write tests for React components
 */

// Example simple component
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

describe('Greeting Component', () => {
  it('should render the greeting with the provided name', () => {
    render(<Greeting name="World" />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })

  it('should render with different names', () => {
    const { rerender } = render(<Greeting name="Alice" />)
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument()

    rerender(<Greeting name="Bob" />)
    expect(screen.getByText('Hello, Bob!')).toBeInTheDocument()
  })
})

// Example interactive component
function Counter() {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

describe('Counter Component', () => {
  it('should start with count of 0', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('should increment the count', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByText('Increment'))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()

    await user.click(screen.getByText('Increment'))
    expect(screen.getByText('Count: 2')).toBeInTheDocument()
  })

  it('should decrement the count', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByText('Decrement'))
    expect(screen.getByText('Count: -1')).toBeInTheDocument()
  })

  it('should reset the count', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByText('Increment'))
    await user.click(screen.getByText('Increment'))
    expect(screen.getByText('Count: 2')).toBeInTheDocument()

    await user.click(screen.getByText('Reset'))
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})

// Example button component
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

function Button({ onClick, children, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
    >
      {children}
    </button>
  )
}

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    )

    await user.click(screen.getByText('Click me'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should have disabled attribute when disabled prop is true', () => {
    render(
      <Button onClick={() => {}} disabled>
        Click me
      </Button>
    )
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
