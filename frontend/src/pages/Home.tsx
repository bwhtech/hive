import { useFrappeAuth } from 'frappe-react-sdk'

export default function Home() {
  const { currentUser, isLoading } = useFrappeAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Hive</h1>
      <p className="text-muted-foreground">
        {currentUser ? `Welcome, ${currentUser}` : 'Project Management Solution'}
      </p>
    </div>
  )
}
