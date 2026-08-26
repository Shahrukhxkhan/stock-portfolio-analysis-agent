/**
 * Share Link Utils
 * Encodes and decodes portfolio state into URL query parameters for instant link sharing.
 */

export function encodePortfolioToShareUrl(portfolioState: any): string {
  try {
    const compactState = {
      allocations: portfolioState?.allocations || [],
      returnsData: portfolioState?.returnsData || [],
      performanceData: portfolioState?.performanceData || [],
      bullInsights: portfolioState?.bullInsights || [],
      bearInsights: portfolioState?.bearInsights || [],
      currentPortfolioValue: portfolioState?.currentPortfolioValue || 0,
      totalReturns: portfolioState?.totalReturns || 0,
      riskMetrics: portfolioState?.riskMetrics || null,
      assetClassDistribution: portfolioState?.assetClassDistribution || null,
      multiAgentCrew: portfolioState?.multiAgentCrew || null,
    }

    const jsonStr = JSON.stringify(compactState)
    const base64Str = typeof btoa !== "undefined" ? btoa(encodeURIComponent(jsonStr)) : Buffer.from(jsonStr).toString("base64")
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/"

    return `${origin}${pathname}?share=${encodeURIComponent(base64Str)}`
  } catch (err) {
    console.error("Error encoding share URL:", err)
    return typeof window !== "undefined" ? window.location.href : "http://localhost:3000"
  }
}

export function decodeShareUrlToPortfolio(shareParam: string): any {
  try {
    const decodedUri = decodeURIComponent(shareParam)
    const jsonStr = typeof atob !== "undefined" ? decodeURIComponent(atob(decodedUri)) : Buffer.from(decodedUri, "base64").toString("utf-8")
    return JSON.parse(jsonStr)
  } catch (err) {
    console.error("Error decoding share URL:", err)
    return null
  }
}

export async function copyShareLinkToClipboard(portfolioState: any): Promise<boolean> {
  try {
    const url = encodePortfolioToShareUrl(portfolioState)
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      return true
    }
    return false
  } catch (err) {
    console.error("Failed to copy link:", err)
    return false
  }
}
