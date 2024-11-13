// components/shared/author-card.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GithubIcon, Linkedin, TwitterIcon } from "lucide-react"

interface AuthorCardProps {
  name: string
  role: string
  bio: string
  avatar: string
  twitter?: string
  github?: string
  linkedin?: string
  company?: {
    name: string
    url: string
  }
}

export function AuthorCard({
  name,
  role,
  bio,
  avatar,
  twitter,
  github,
  linkedin,
  company,
}: AuthorCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col items-center space-y-4 p-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
          {company && (
            <a 
              href={company.url}
              className="text-sm text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {company.name}
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{bio}</p>
        <div className="flex space-x-2">
          {twitter && (
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a 
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          {github && (
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a 
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          {linkedin && (
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a 
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

