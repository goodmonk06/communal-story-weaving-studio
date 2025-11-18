'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Fragment {
  id: string
  title: string
  bodyMarkdown: string
  tags: string[]
  memberId: string
}

interface FragmentSelection {
  id: string
  role: 'CORE' | 'SUPPORTING' | 'QUOTE'
  fragment: Fragment
}

interface WovenVersion {
  id: string
  versionNumber: number
  bodyMarkdown: string
  aiMetadata: {
    model: string
    temperature: number
    fragmentMapping: Record<string, any>
    generatedAt: string
  }
  createdAt: string
}

interface Project {
  id: string
  title: string
  descriptionMarkdown: string
  fragmentSelections: FragmentSelection[]
  wovenVersions: WovenVersion[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [allFragments, setAllFragments] = useState<Fragment[]>([])
  const [loading, setLoading] = useState(true)
  const [weaving, setWeaving] = useState(false)
  const [showFragmentSelector, setShowFragmentSelector] = useState(false)
  const [activeTab, setActiveTab] = useState<'versions' | 'fragments'>('versions')

  useEffect(() => {
    fetchProject()
    fetchAllFragments()
  }, [projectId])

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      const data = await res.json()
      setProject(data.project)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAllFragments() {
    try {
      const res = await fetch('/api/fragments')
      const data = await res.json()
      setAllFragments(data.fragments)
    } catch (error) {
      console.error('Error fetching fragments:', error)
    }
  }

  async function handleWeaveStory() {
    if (!project) return
    setWeaving(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/ai-weave`, {
        method: 'POST',
      })

      if (res.ok) {
        await fetchProject()
        alert('Story woven successfully!')
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error weaving story:', error)
      alert('Failed to weave story')
    } finally {
      setWeaving(false)
    }
  }

  async function handleAddFragment(fragmentId: string, role: 'CORE' | 'SUPPORTING' | 'QUOTE') {
    try {
      const res = await fetch(`/api/projects/${projectId}/fragments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragmentId, role }),
      })

      if (res.ok) {
        await fetchProject()
        setShowFragmentSelector(false)
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding fragment:', error)
    }
  }

  async function handleRemoveFragment(fragmentId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/fragments?fragmentId=${fragmentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchProject()
      }
    } catch (error) {
      console.error('Error removing fragment:', error)
    }
  }

  if (loading || !project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Loading project...</p>
      </div>
    )
  }

  const selectedFragmentIds = project.fragmentSelections.map((s) => s.fragment.id)
  const availableFragments = allFragments.filter((f) => !selectedFragmentIds.includes(f.id))
  const latestVersion = project.wovenVersions[0]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="prose dark:prose-invert max-w-none mb-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.descriptionMarkdown}
          </ReactMarkdown>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleWeaveStory}
            disabled={weaving || project.fragmentSelections.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition font-semibold"
          >
            {weaving ? '🧵 Weaving...' : '🧵 Weave Story with AI'}
          </button>
          <button
            onClick={() => setShowFragmentSelector(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            + Add Fragment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-4 py-2 border-b-2 transition ${
              activeTab === 'versions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Woven Versions ({project.wovenVersions.length})
          </button>
          <button
            onClick={() => setActiveTab('fragments')}
            className={`px-4 py-2 border-b-2 transition ${
              activeTab === 'fragments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Selected Fragments ({project.fragmentSelections.length})
          </button>
        </div>
      </div>

      {/* Versions Tab */}
      {activeTab === 'versions' && (
        <div>
          {project.wovenVersions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-500 mb-4">
                No woven versions yet. Add fragments and click &quot;Weave Story with AI&quot; to generate one.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {project.wovenVersions.map((version) => (
                <div
                  key={version.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Version {version.versionNumber}</h2>
                      <p className="text-sm text-gray-500">
                        Generated {new Date(version.createdAt).toLocaleString()} •{' '}
                        Model: {version.aiMetadata.model}
                      </p>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {version.bodyMarkdown}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <details className="cursor-pointer">
                      <summary className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        View AI Metadata & Traceability
                      </summary>
                      <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(version.aiMetadata, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fragments Tab */}
      {activeTab === 'fragments' && (
        <div>
          {project.fragmentSelections.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-500 mb-4">No fragments selected yet. Click &quot;Add Fragment&quot; to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {['CORE', 'SUPPORTING', 'QUOTE'].map((role) => {
                const roleFragments = project.fragmentSelections.filter((s) => s.role === role)
                if (roleFragments.length === 0) return null

                return (
                  <div key={role}>
                    <h3 className="text-xl font-bold mb-4">
                      {role === 'CORE' && '⭐ Core Fragments'}
                      {role === 'SUPPORTING' && '📚 Supporting Fragments'}
                      {role === 'QUOTE' && '💬 Quote Fragments'}
                    </h3>
                    <div className="grid gap-4">
                      {roleFragments.map((selection) => (
                        <div
                          key={selection.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold">{selection.fragment.title}</h4>
                            <button
                              onClick={() => handleRemoveFragment(selection.fragment.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            By {selection.fragment.memberId}
                          </p>
                          <p className="text-sm line-clamp-2">{selection.fragment.bodyMarkdown}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Fragment Selector Modal */}
      {showFragmentSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Fragment to Project</h2>
              <button
                onClick={() => setShowFragmentSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>

            {availableFragments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                All available fragments have been added to this project.
              </p>
            ) : (
              <div className="space-y-4">
                {availableFragments.map((fragment) => (
                  <div
                    key={fragment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="font-bold mb-2">{fragment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      By {fragment.memberId}
                    </p>
                    <p className="text-sm mb-4 line-clamp-3">{fragment.bodyMarkdown}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddFragment(fragment.id, 'CORE')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        ⭐ Core
                      </button>
                      <button
                        onClick={() => handleAddFragment(fragment.id, 'SUPPORTING')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        📚 Supporting
                      </button>
                      <button
                        onClick={() => handleAddFragment(fragment.id, 'QUOTE')}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                      >
                        💬 Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
