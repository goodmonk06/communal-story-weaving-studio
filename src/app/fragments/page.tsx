'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Fragment {
  id: string
  title: string
  bodyMarkdown: string
  tags: string[]
  memberId: string
  communityId: string
  createdAt: string
}

export default function FragmentsPage() {
  const [fragments, setFragments] = useState<Fragment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchFragments()
  }, [])

  async function fetchFragments() {
    try {
      const res = await fetch('/api/fragments')
      const data = await res.json()
      setFragments(data.fragments)
    } catch (error) {
      console.error('Error fetching fragments:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateFragment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const tagsInput = formData.get('tags') as string
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/fragments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: formData.get('memberId'),
          communityId: formData.get('communityId'),
          title: formData.get('title'),
          bodyMarkdown: formData.get('bodyMarkdown'),
          tags,
        }),
      })

      if (res.ok) {
        setShowCreateForm(false)
        fetchFragments()
        e.currentTarget.reset()
      }
    } catch (error) {
      console.error('Error creating fragment:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Loading fragments...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Story Fragments</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {showCreateForm ? 'Cancel' : '+ New Fragment'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Create New Fragment</h2>
          <form onSubmit={handleCreateFragment} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Member ID</label>
                <input
                  type="text"
                  name="memberId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  placeholder="e.g., member-alice"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Community ID</label>
                <input
                  type="text"
                  name="communityId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  placeholder="e.g., demo-community"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                placeholder="Give your story fragment a title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Story (Markdown)</label>
              <textarea
                name="bodyMarkdown"
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 font-mono"
                placeholder="Write your story using Markdown..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                placeholder="e.g., journey, learning, community"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create Fragment
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {fragments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 mb-4">No fragments yet. Create your first one!</p>
          </div>
        ) : (
          fragments.map((fragment) => (
            <div
              key={fragment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold">{fragment.title}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(fragment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  By {fragment.memberId} • {fragment.communityId}
                </span>
              </div>
              <div className="prose dark:prose-invert max-w-none mb-4">
                <p className="line-clamp-3">{fragment.bodyMarkdown}</p>
              </div>
              {fragment.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
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
              <Link
                href={`/fragments/${fragment.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View full fragment →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
