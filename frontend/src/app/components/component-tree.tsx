"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { PortfolioState } from "@/app/page"

interface ComponentTreeProps {
  portfolioState: PortfolioState
}

interface TreeNode {
  id: string
  name: string
  type: string
  children?: TreeNode[]
}

export function ComponentTree({ portfolioState }: ComponentTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["root", "performance", "allocation-returns", "insights"]),
  )

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const treeData: TreeNode = {
    id: "root",
    name: "Canvas",
    type: "Container",
    children: [
      {
        id: "performance",
        name: "Performance",
        type: "Section",
        children: [{ id: "line-chart", name: "Line Chart", type: "Chart" }],
      },
      {
        id: "allocation-returns",
        name: "Data Grid",
        type: "Grid",
        children: [
          { id: "alloc-table", name: "Allocation", type: "Table" },
          { id: "bar-chart", name: "Returns", type: "Chart" },
        ],
      },
      {
        id: "insights",
        name: "Market Insights",
        type: "Section",
        children: [
          {
            id: "bull-section",
            name: "Bull Case",
            type: "Column",
            children: portfolioState.bullInsights.map((_, index) => ({
              id: `bull-${index}`,
              name: `Bull Insight ${index + 1}`,
              type: "Card",
            })),
          },
          {
            id: "bear-section",
            name: "Bear Case",
            type: "Column",
            children: portfolioState.bearInsights.map((_, index) => ({
              id: `bear-${index}`,
              name: `Bear Insight ${index + 1}`,
              type: "Card",
            })),
          },
        ],
      },
    ],
  }

  const renderNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-1 hover:bg-[#F3F4F8] rounded cursor-pointer text-xs transition-colors`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={12} className="text-[#6B7A99] mr-1" />
            ) : (
              <ChevronRight size={12} className="text-[#6B7A99] mr-1" />
            )
          ) : (
            <div className="w-3 mr-1" />
          )}
          <span className="text-xs text-[#101828] font-medium truncate">{node.name}</span>
          <span className="text-xs text-[#6B7A99] ml-1">({node.type})</span>
        </div>
        {hasChildren && isExpanded && <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] text-[#101828]">
      <div className="p-3 border-b border-[#E2E6EF]">
        <h2 className="text-sm font-semibold text-[#101828] font-['Roobert']">Component Tree</h2>
        <p className="text-xs text-[#6B7A99] mt-1">Layout structure</p>
      </div>

      <div className="flex-1 overflow-auto p-2">{renderNode(treeData)}</div>

      <div className="p-3 border-t border-[#E2E6EF] bg-[#F3F4F8]">
        <div className="text-xs text-[#6B7A99] space-y-1">
          <div>Components: {portfolioState.bullInsights.length + portfolioState.bearInsights.length + 5}</div>
          <div>Updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
}
