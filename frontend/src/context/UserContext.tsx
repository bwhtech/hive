import { createContext, use } from "react"
import { useFrappeAuth, useFrappeGetDoc } from "frappe-react-sdk"

interface UserData {
  email: string
  full_name: string
  user_image: string | null
}

interface UserContextValue {
  user: UserData | null
  isLoading: boolean
  isClient: boolean
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  isClient: false,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useFrappeAuth()

  const { data, isLoading } = useFrappeGetDoc<{
    name: string
    full_name: string
    user_image: string | null
  }>(
    "User",
    currentUser ?? "",
    currentUser ? undefined : null,
    {
      revalidateOnFocus: false,
    }
  )

  const { data: memberData } = useFrappeGetDoc<{
    name: string
    type: string
  }>(
    "Hive Member",
    currentUser ?? "",
    currentUser ? undefined : null,
    {
      revalidateOnFocus: false,
    }
  )

  const user: UserData | null = data
    ? {
        email: data.name,
        full_name: data.full_name,
        user_image: data.user_image,
      }
    : null

  const isClient = memberData?.type === "Client"

  return (
    <UserContext.Provider value={{ user, isLoading, isClient }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return use(UserContext)
}
