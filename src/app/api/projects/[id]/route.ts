import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  descriptionMarkdown: z.string().min(1).optional(),
})

// GET /api/projects/:id - Get a single project with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.storyWeaveProject.findUnique({
      where: { id: params.id },
      include: {
        fragmentSelections: {
          include: {
            fragment: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        wovenVersions: {
          orderBy: {
            versionNumber: 'desc',
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse tags for each fragment
    const projectWithParsedData = {
      ...project,
      fragmentSelections: project.fragmentSelections.map((selection) => ({
        ...selection,
        fragment: {
          ...selection.fragment,
          tags: JSON.parse(selection.fragment.tagsJson),
        },
      })),
      wovenVersions: project.wovenVersions.map((version) => ({
        ...version,
        aiMetadata: JSON.parse(version.aiMetadataJson),
      })),
    }

    return NextResponse.json({ project: projectWithParsedData })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/:id - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    const project = await prisma.storyWeaveProject.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        fragmentSelections: {
          include: {
            fragment: true,
          },
        },
        wovenVersions: {
          orderBy: {
            versionNumber: 'desc',
          },
        },
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/:id - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.storyWeaveProject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
