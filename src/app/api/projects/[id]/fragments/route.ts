import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addFragmentSchema = z.object({
  fragmentId: z.string().min(1),
  role: z.enum(['CORE', 'SUPPORTING', 'QUOTE']).default('SUPPORTING'),
})

// POST /api/projects/:id/fragments - Add a fragment to the project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = addFragmentSchema.parse(body)

    // Check if the fragment is already in the project
    const existing = await prisma.storyFragmentSelection.findUnique({
      where: {
        projectId_fragmentId: {
          projectId: params.id,
          fragmentId: validatedData.fragmentId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Fragment already added to this project' },
        { status: 400 }
      )
    }

    const selection = await prisma.storyFragmentSelection.create({
      data: {
        projectId: params.id,
        fragmentId: validatedData.fragmentId,
        role: validatedData.role,
      },
      include: {
        fragment: true,
      },
    })

    return NextResponse.json({
      selection: {
        ...selection,
        fragment: {
          ...selection.fragment,
          tags: JSON.parse(selection.fragment.tagsJson),
        },
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error adding fragment to project:', error)
    return NextResponse.json(
      { error: 'Failed to add fragment to project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/:id/fragments - Remove a fragment from the project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const fragmentId = searchParams.get('fragmentId')

    if (!fragmentId) {
      return NextResponse.json(
        { error: 'fragmentId is required' },
        { status: 400 }
      )
    }

    await prisma.storyFragmentSelection.delete({
      where: {
        projectId_fragmentId: {
          projectId: params.id,
          fragmentId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing fragment from project:', error)
    return NextResponse.json(
      { error: 'Failed to remove fragment from project' },
      { status: 500 }
    )
  }
}
