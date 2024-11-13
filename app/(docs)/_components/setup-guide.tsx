// components/stratum/setup-guide.tsx
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VerifyResponse {
    verified: boolean
    user: {
      id: string
      name: string | null
      email: string
      role: string
      profileStatus: string
      slug: string
      image: string | null
    }
  }

export function StratumSetup() {
    const [token, setToken] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [userData, setUserData] = useState<VerifyResponse['user'] | null>(null)
   const {toast} = useToast()
   const verifyConnection = async () => {
    setIsVerifying(true)
    try {
      const res = await fetch('http://localhost:3009/api/auth/extension-token/verify', {
        headers: {
          'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || ''
        }
      })
      
      if (!res.ok) {
        throw new Error(await res.text())
      }

      const data = await res.json()
      setIsVerified(true)
      setUserData(data.user)
      
      toast({
        title: "Connection Verified!",
        description: `Connected as ${data.user.name}`,
      })
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please check your STRATUM_TOKEN in .env",
        variant: "destructive"
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-8">
      <Alert>
        <AlertDescription>
          Follow these steps to connect your project to Stratum
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
                1
              </div>
              Install VS Code Extension
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Install the Stratum extension from the VS Code marketplace to enable AI-assisted development.
            </p>
            <Button
              asChild
              className="w-full sm:w-auto"
            >
              <a 
                href="https://marketplace.visualstudio.com/items?itemName=stratum"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install Extension
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
                2
              </div>
              Get Your API Token
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Visit TNDevs to generate an API token for your project.
            </p>
            <Button
              asChild
              className="w-full sm:w-auto"
            >
              <a 
                href="http://localhost:3009/dashboard/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
              >
                Generate Token on TNDevs
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
                3
              </div>
              Configure Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Add your token to your projects environment variables and restart your development server.
            </p>
            <div className="rounded-md bg-muted p-4">
              <code>NEXT_PUBLIC_STRATUM_TOKEN=your_token_here</code>
            </div>
            <Button 
              onClick={verifyConnection}
              disabled={isVerified || isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Connection...
                </>
              ) : isVerified ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected Successfully
                </>
              ) : (
                'Verify Connection'
              )}
            </Button>
            {isVerified && userData && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">
                    Connected to TNDevs as {userData.name}
                  </p>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  Your project is ready to use Stratum!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}