import { Spinner } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useAuth from "../hooks/useAuth"
import { ReactNode, useState, useEffect, Suspense } from "react"

const LoginGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const { accessToken, fetcher, updateToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) {
      router.push("/")
      return
    }

    fetcher()
      .get("/auth/refresh")
      .then(({ data }) => {
        updateToken(data.access_token)
        if (data.access_token) setIsLoading(false)
      })
      .catch(() => {
        router.push("/")
      })
  }, [accessToken])

  return <Suspense fallback={<Spinner />}>{!isLoading && children}</Suspense>
}

export default LoginGuard
