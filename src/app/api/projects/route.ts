import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  communityId: z.string().min(1),
  title: z.string().min(1),
  descriptionMarkdown: z.string().min(1),
})

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get('communityId')

    const projects = await prisma.storyWeaveProject.findMany({
      where: {
        ...(communityId && { communityId }),
      },
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
          take: 1, // Only get the latest version for the list view
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      projects: projects.map((project) => ({
        ...project,
        fragmentCount: project.fragmentSelections.length,
        latestVersion: project.wovenVersions[0] || null,
      })),
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await prisma.storyWeaveProject.create({
      data: {
        communityId: validatedData.communityId,
        title: validatedData.title,
        descriptionMarkdown: validatedData.descriptionMarkdown,
      },
      include: {
        fragmentSelections: true,
        wovenVersions: true,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
