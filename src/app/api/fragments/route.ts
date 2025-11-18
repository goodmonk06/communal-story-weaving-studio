import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFragmentSchema = z.object({
  memberId: z.string().min(1),
  communityId: z.string().min(1),
  title: z.string().min(1),
  bodyMarkdown: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
})

// GET /api/fragments - List all fragments with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get('communityId')
    const memberId = searchParams.get('memberId')

    const fragments = await prisma.rawStoryFragment.findMany({
      where: {
        ...(communityId && { communityId }),
        ...(memberId && { memberId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Parse tagsJson for each fragment
    const fragmentsWithParsedTags = fragments.map((fragment) => ({
      ...fragment,
      tags: JSON.parse(fragment.tagsJson),
    }))

    return NextResponse.json({
      fragments: fragmentsWithParsedTags,
    })
  } catch (error) {
    console.error('Error fetching fragments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fragments' },
      { status: 500 }
    )
  }
}

// POST /api/fragments - Create a new fragment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createFragmentSchema.parse(body)

    const fragment = await prisma.rawStoryFragment.create({
      data: {
        memberId: validatedData.memberId,
        communityId: validatedData.communityId,
        title: validatedData.title,
        bodyMarkdown: validatedData.bodyMarkdown,
        tagsJson: JSON.stringify(validatedData.tags),
      },
    })

    return NextResponse.json({
      fragment: {
        ...fragment,
        tags: JSON.parse(fragment.tagsJson),
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating fragment:', error)
    return NextResponse.json(
      { error: 'Failed to create fragment' },
      { status: 500 }
    )
  }
}
