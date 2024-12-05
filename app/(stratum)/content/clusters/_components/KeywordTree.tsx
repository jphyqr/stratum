// app/(stratum)/content/_components/KeywordList.tsx
import { Suspense } from "react"
import { Bot, KeyRound } from "lucide-react"

import { buildKeywordTree } from "@/lib/keywords"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Keyword } from "../types"
import { KeywordItem } from "./KeywordItem"
import { KeywordItemSkeleton } from "./KeywordItemSkeleton"

interface KeywordListProps {
  promise: Promise<Response>
  clusterId: string
  showTree: boolean
}

export async function KeywordTree({
  promise,
  clusterId,
  showTree,
}: KeywordListProps) {
  const keywords = (await promise.then((res) => res.json())) as Keyword[]

  const keywordTree = buildKeywordTree(keywords)

  if (!showTree) {
    return <EmptyKeywords />
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {keywordTree.map((keyword: Keyword) => (
            <Suspense
              key={keyword.id}
              fallback={<KeywordItemSkeleton depth={0} />}
            >
              <KeywordItem keyword={keyword} clusterId={clusterId} depth={0} />
            </Suspense>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const EmptyKeywords = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-muted p-3">
            <KeyRound className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">No Keywords Yet</h3>
            <p className="text-sm text-muted-foreground">
              Generate keywords to start building your content hierarchy
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
