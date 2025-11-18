import { describe, it, expect, beforeEach, vi } from 'vitest'
import { eventBus, onEvent, emitEvent, DomainEvent } from '../events'

describe('Event Bus', () => {
  beforeEach(() => {
    eventBus.clear()
  })

  it('should register and call event handlers', async () => {
    const handler = vi.fn()

    onEvent('fragment.created', handler)

    await emitEvent('fragment.created', {
      fragmentId: '123',
      memberId: 'user1',
      communityId: 'community1',
      title: 'Test Fragment',
    })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'fragment.created',
        payload: expect.objectContaining({
          fragmentId: '123',
        }),
      })
    )
  })

  it('should call multiple handlers for the same event', async () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    onEvent('project.created', handler1)
    onEvent('project.created', handler2)

    await emitEvent('project.created', {
      projectId: 'proj1',
      communityId: 'community1',
      createdBy: 'user1',
      title: 'Test Project',
    })

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('should unsubscribe handlers', async () => {
    const handler = vi.fn()

    const unsubscribe = onEvent('story.woven', handler)

    await emitEvent('story.woven', {
      projectId: 'proj1',
      versionNumber: 1,
      fragmentCount: 5,
      cost: 0.1,
    })

    expect(handler).toHaveBeenCalledTimes(1)

    unsubscribe()

    await emitEvent('story.woven', {
      projectId: 'proj2',
      versionNumber: 1,
      fragmentCount: 3,
      cost: 0.05,
    })

    expect(handler).toHaveBeenCalledTimes(1) // Should still be 1
  })

  it('should handle async handlers', async () => {
    const results: string[] = []

    onEvent('comment.created', async (event: DomainEvent) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      results.push(`handler1-${event.payload.commentId}`)
    })

    onEvent('comment.created', async (event: DomainEvent) => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      results.push(`handler2-${event.payload.commentId}`)
    })

    await emitEvent('comment.created', {
      commentId: 'comment1',
      memberId: 'user1',
      content: 'Great story!',
    })

    expect(results).toHaveLength(2)
    expect(results).toContain('handler1-comment1')
    expect(results).toContain('handler2-comment1')
  })

  it('should not throw if handler throws an error', async () => {
    const errorHandler = vi.fn(() => {
      throw new Error('Handler error')
    })

    const goodHandler = vi.fn()

    onEvent('reaction.added', errorHandler)
    onEvent('reaction.added', goodHandler)

    await expect(
      emitEvent('reaction.added', {
        reactionId: 'reaction1',
        memberId: 'user1',
        fragmentId: 'frag1',
        reactionType: 'LIKE',
      })
    ).resolves.not.toThrow()

    expect(errorHandler).toHaveBeenCalled()
    expect(goodHandler).toHaveBeenCalled()
  })

  it('should add metadata to events', async () => {
    const handler = vi.fn()

    onEvent('member.joined', handler)

    await emitEvent(
      'member.joined',
      {
        memberId: 'user1',
        communityId: 'community1',
        username: 'alice',
      },
      {
        userId: 'admin1',
        source: 'invite-flow',
      }
    )

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          userId: 'admin1',
          source: 'invite-flow',
          timestamp: expect.any(Date),
        }),
      })
    )
  })
})
