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

// Site name is required for the realtime socket in Frappe v15+. It's injected onto
// window by www/hive.html; fall back to the current host for the dev server.
const siteName =
  (window as unknown as { site_name?: string }).site_name || window.location.hostname
// socketPort is only for local dev (vite on a non-standard port); undefined in
// production, where the socket rides the site's own host/proxy.
const socketPort = import.meta.env.DEV ? "9000" : undefined

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <FrappeProvider siteName={siteName} socketPort={socketPort}>
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
