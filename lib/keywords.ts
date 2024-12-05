import { Keyword } from "@/app/(stratum)/content/clusters/types";

// lib/utils/keywords.ts
export function buildKeywordTree(keywords: Keyword[]): Keyword[] {
    const keywordMap = new Map<string, Keyword & { children: Keyword[] }>();
    const rootKeywords: (Keyword & { children: Keyword[] })[] = [];

    // First pass: Create map of all keywords with empty children array
    keywords.forEach(keyword => {
        keywordMap.set(keyword.id, { ...keyword, children: [] });
    });

    // Second pass: Build the tree structure
    keywords.forEach(keyword => {
        const keywordWithChildren = keywordMap.get(keyword.id)!;
        if (keyword.parentId) {
            const parent = keywordMap.get(keyword.parentId);
            if (parent) {
                parent.children.push(keywordWithChildren);
            }
        } else {
            rootKeywords.push(keywordWithChildren);
        }
    });

    return rootKeywords;
}