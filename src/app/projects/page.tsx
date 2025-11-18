'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  descriptionMarkdown: string
  communityId: string
  createdAt: string
  fragmentCount: number
  latestVersion: {
    versionNumber: number
    createdAt: string
  } | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId: formData.get('communityId'),
          title: formData.get('title'),
          descriptionMarkdown: formData.get('descriptionMarkdown'),
        }),
      })

      if (res.ok) {
        setShowCreateForm(false)
        fetchProjects()
        e.currentTarget.reset()
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Weaving Projects</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {showCreateForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                placeholder="Give your weaving project a title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Markdown)</label>
              <textarea
                name="descriptionMarkdown"
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 font-mono"
                placeholder="Describe what this weaving project aims to create..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 mb-4">No projects yet. Create your first one!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {project.communityId}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                {project.descriptionMarkdown}
              </p>
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <span>📝 {project.fragmentCount} fragments</span>
                {project.latestVersion && (
                  <span>
                    🧵 Version {project.latestVersion.versionNumber} •{' '}
                    {new Date(project.latestVersion.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <Link
                href={`/projects/${project.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Open Project →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
