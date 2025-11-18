import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateFragmentSchema = z.object({
  title: z.string().min(1).optional(),
  bodyMarkdown: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/fragments/:id - Get a single fragment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fragment = await prisma.rawStoryFragment.findUnique({
      where: { id: params.id },
      include: {
        selections: {
          include: {
            project: true,
          },
        },
      },
    })

    if (!fragment) {
      return NextResponse.json(
        { error: 'Fragment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      fragment: {
        ...fragment,
        tags: JSON.parse(fragment.tagsJson),
      },
    })
  } catch (error) {
    console.error('Error fetching fragment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fragment' },
      { status: 500 }
    )
  }
}

// PATCH /api/fragments/:id - Update a fragment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateFragmentSchema.parse(body)

    const updateData: any = {}
    if (validatedData.title) updateData.title = validatedData.title
    if (validatedData.bodyMarkdown) updateData.bodyMarkdown = validatedData.bodyMarkdown
    if (validatedData.tags) updateData.tagsJson = JSON.stringify(validatedData.tags)

    const fragment = await prisma.rawStoryFragment.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      fragment: {
        ...fragment,
        tags: JSON.parse(fragment.tagsJson),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating fragment:', error)
    return NextResponse.json(
      { error: 'Failed to update fragment' },
      { status: 500 }
    )
  }
}

// DELETE /api/fragments/:id - Delete a fragment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rawStoryFragment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fragment:', error)
    return NextResponse.json(
      { error: 'Failed to delete fragment' },
      { status: 500 }
    )
  }
}
