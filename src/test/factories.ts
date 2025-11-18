/**
 * Test Data Factories
 * Generate test data for entities with sensible defaults
 */

import type {
  Community,
  Member,
  RawStoryFragment,
  StoryWeaveProject,
  Tag,
  Comment,
} from '@prisma/client'

let idCounter = 1

function generateId(prefix = 'test'): string {
  return `${prefix}_${idCounter++}_${Date.now()}`
}

export function createCommunityData(overrides?: Partial<Community>): Omit<Community, 'createdAt' | 'updatedAt'> {
  const id = generateId('community')
  return {
    id,
    name: `Test Community ${id}`,
    slug: `test-community-${id}`,
    description: 'A test community for story weaving',
    settings: '{}',
    avatarUrl: null,
    ...overrides,
  }
}

export function createMemberData(
  communityId: string,
  overrides?: Partial<Member>
): Omit<Member, 'createdAt' | 'updatedAt'> {
  const id = generateId('member')
  return {
    id,
    communityId,
    externalUserId: null,
    username: `user${id}`,
    email: `user${id}@example.com`,
    displayName: `Test User ${id}`,
    bio: 'A passionate storyteller',
    avatarUrl: null,
    preferences: '{}',
    status: 'ACTIVE' as const,
    ...overrides,
  }
}

export function createTagData(communityId: string, overrides?: Partial<Tag>): Omit<Tag, 'createdAt'> {
  const id = generateId('tag')
  const name = overrides?.name || `Tag ${id}`
  return {
    id,
    communityId,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: `Description for ${name}`,
    color: '#3B82F6',
    usageCount: 0,
    ...overrides,
  }
}

export function createFragmentData(
  memberId: string,
  communityId: string,
  overrides?: Partial<RawStoryFragment>
): Omit<RawStoryFragment, 'createdAt' | 'updatedAt'> {
  const id = generateId('fragment')
  return {
    id,
    memberId,
    communityId,
    title: `Test Fragment ${id}`,
    bodyMarkdown: `This is a test story fragment with meaningful content. It tells a story about challenges, growth, and community support.`,
    status: 'PUBLISHED' as const,
    visibility: 'COMMUNITY' as const,
    metadata: '{}',
    editCount: 0,
    viewCount: 0,
    lastEditedAt: null,
    deletedAt: null,
    ...overrides,
  }
}

export function createProjectData(
  communityId: string,
  createdBy: string,
  overrides?: Partial<StoryWeaveProject>
): Omit<StoryWeaveProject, 'createdAt' | 'updatedAt'> {
  const id = generateId('project')
  return {
    id,
    communityId,
    createdBy,
    title: `Test Project ${id}`,
    descriptionMarkdown: 'A project to weave community stories together',
    status: 'ACTIVE' as const,
    visibility: 'COMMUNITY' as const,
    metadata: '{}',
    aiGenerationCost: 0,
    deletedAt: null,
    ...overrides,
  }
}

export function createCommentData(
  memberId: string,
  overrides?: Partial<Comment>
): Omit<Comment, 'createdAt' | 'updatedAt'> {
  const id = generateId('comment')
  return {
    id,
    memberId,
    fragmentId: null,
    projectId: null,
    parentId: null,
    content: 'This is a thoughtful comment on the story.',
    deletedAt: null,
    ...overrides,
  }
}

// Sample story fragments for realistic testing
export const sampleFragmentBodies = [
  `When I first joined this community, I felt lost and uncertain. But the support I received from fellow members changed everything. They showed me that I wasn't alone in my struggles.`,

  `I'll never forget the day we launched our first collaborative project. Everyone brought their unique skills and perspectives. Together, we created something none of us could have done alone.`,

  `The turning point came during a late-night discussion. Someone shared their story of overcoming similar challenges. Their vulnerability inspired me to keep pushing forward, even when things seemed impossible.`,

  `Community isn't just about being together—it's about growing together. Every conversation, every shared experience, every moment of support builds something larger than ourselves.`,

  `I used to think success meant doing everything on my own. This community taught me that real strength comes from knowing when to ask for help and being willing to offer it in return.`,
]

// Sample community settings
export const sampleCommunitySettings = {
  allowPublicFragments: true,
  requireApproval: false,
  maxFragmentsPerMember: 100,
  aiProvider: 'openai',
  theme: 'light',
}

// Sample member preferences
export const sampleMemberPreferences = {
  emailNotifications: true,
  digestFrequency: 'weekly',
  timezone: 'America/New_York',
  language: 'en',
}
