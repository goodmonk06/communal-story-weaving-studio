'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

interface Fragment {
  id: string
  title: string
  bodyMarkdown: string
  tags: string[]
  memberId: string
  communityId: string
  createdAt: string
  selections: Array<{
    project: {
      id: string
      title: string
    }
  }>
}

export default function FragmentDetailPage() {
  const params = useParams()
  const fragmentId = params.id as string

  const [fragment, setFragment] = useState<Fragment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFragment()
  }, [fragmentId])

  async function fetchFragment() {
    try {
      const res = await fetch(`/api/fragments/${fragmentId}`)
      const data = await res.json()
      setFragment(data.fragment)
    } catch (error) {
      console.error('Error fetching fragment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Loading fragment...</p>
      </div>
    )
  }

  if (!fragment) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-500 mb-4">Fragment not found</p>
          <Link href="/fragments" className="text-blue-600 hover:underline">
            ← Back to fragments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/fragments"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to all fragments
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold mb-4">{fragment.title}</h1>

          <div className="flex gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <span>👤 {fragment.memberId}</span>
            <span>🏘️ {fragment.communityId}</span>
            <span>📅 {new Date(fragment.createdAt).toLocaleDateString()}</span>
          </div>

          {fragment.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {fragment.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {fragment.bodyMarkdown}
            </ReactMarkdown>
          </div>

          {fragment.selections && fragment.selections.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">Used in Projects</h2>
              <div className="space-y-2">
                {fragment.selections.map((selection) => (
                  <Link
                    key={selection.project.id}
                    href={`/projects/${selection.project.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    🧵 {selection.project.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
