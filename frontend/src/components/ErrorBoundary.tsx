import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
          <div className="rounded-2xl border border-dashed p-10">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              An unexpected error occurred. Try reloading the page.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
                {this.state.error.message}
              </pre>
            )}
            <Button
              className="mt-6"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
