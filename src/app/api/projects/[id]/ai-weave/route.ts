import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { weaveStoryFragments } from '@/lib/ai-weaver'

// POST /api/projects/:id/ai-weave - Generate a new woven story version using AI
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch the project with all selected fragments
    const project = await prisma.storyWeaveProject.findUnique({
      where: { id: params.id },
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
          take: 1,
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.fragmentSelections.length === 0) {
      return NextResponse.json(
        { error: 'Project has no fragments selected. Add fragments before weaving.' },
        { status: 400 }
      )
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Set OPENAI_API_KEY in environment variables.' },
        { status: 500 }
      )
    }

    // Prepare fragments for weaving
    const fragments = project.fragmentSelections.map((selection) => ({
      id: selection.fragment.id,
      title: selection.fragment.title,
      bodyMarkdown: selection.fragment.bodyMarkdown,
      role: selection.role,
      memberId: selection.fragment.memberId,
    }))

    // Weave the story using AI
    const weaveResult = await weaveStoryFragments(
      project.title,
      project.descriptionMarkdown,
      fragments
    )

    // Determine the next version number
    const latestVersion = project.wovenVersions[0]
    const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1

    // Create the new woven version
    const wovenVersion = await prisma.wovenStoryVersion.create({
      data: {
        projectId: project.id,
        versionNumber: nextVersionNumber,
        bodyMarkdown: weaveResult.bodyMarkdown,
        aiMetadataJson: JSON.stringify(weaveResult.metadata),
      },
    })

    return NextResponse.json({
      version: {
        ...wovenVersion,
        aiMetadata: JSON.parse(wovenVersion.aiMetadataJson),
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error weaving story:', error)

    // Handle OpenAI API errors specifically
    if (error?.error?.type === 'invalid_request_error') {
      return NextResponse.json(
        { error: 'Invalid AI request. Check your OpenAI API configuration.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to weave story', details: error.message },
      { status: 500 }
    )
  }
}
