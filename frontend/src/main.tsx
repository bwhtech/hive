import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { FrappeProvider } from "frappe-react-sdk"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <FrappeProvider>
        <ThemeProvider defaultTheme="system" storageKey="hive-ui-theme">
          <TooltipProvider>
            <BrowserRouter basename="/hive">
              <App />
              <Toaster position="top-right" />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </FrappeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
