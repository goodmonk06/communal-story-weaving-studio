/**
 * Domain Events System
 * Allows loose coupling between different parts of the application
 */

export type DomainEventType =
  | 'fragment.created'
  | 'fragment.updated'
  | 'fragment.deleted'
  | 'project.created'
  | 'project.updated'
  | 'project.deleted'
  | 'story.woven'
  | 'comment.created'
  | 'reaction.added'
  | 'member.joined'
  | 'collaborator.added'

export interface DomainEvent<T = any> {
  type: DomainEventType
  payload: T
  metadata?: {
    userId?: string
    timestamp: Date
    source?: string
  }
}

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void

class EventBus {
  private handlers: Map<DomainEventType, EventHandler[]> = new Map()

  /**
   * Register an event handler
   */
  on<T = any>(eventType: DomainEventType, handler: EventHandler<T>): () => void {
    const handlers = this.handlers.get(eventType) || []
    handlers.push(handler as EventHandler)
    this.handlers.set(eventType, handlers)

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.handlers.get(eventType) || []
      const index = currentHandlers.indexOf(handler as EventHandler)
      if (index > -1) {
        currentHandlers.splice(index, 1)
      }
    }
  }

  /**
   * Emit an event
   */
  async emit<T = any>(event: DomainEvent<T>): Promise<void> {
    const handlers = this.handlers.get(event.type) || []

    // Execute all handlers in parallel
    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      })
    )
  }

  /**
   * Remove all handlers for an event type
   */
  off(eventType: DomainEventType): void {
    this.handlers.delete(eventType)
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear()
  }
}

// Singleton event bus
export const eventBus = new EventBus()

// Convenience functions
export function onEvent<T = any>(eventType: DomainEventType, handler: EventHandler<T>): () => void {
  return eventBus.on(eventType, handler)
}

export async function emitEvent<T = any>(
  type: DomainEventType,
  payload: T,
  metadata?: DomainEvent['metadata']
): Promise<void> {
  await eventBus.emit({
    type,
    payload,
    metadata: {
      timestamp: new Date(),
      ...metadata,
    },
  })
}

// Event payload types
export interface FragmentCreatedPayload {
  fragmentId: string
  memberId: string
  communityId: string
  title: string
}

export interface ProjectCreatedPayload {
  projectId: string
  communityId: string
  createdBy: string
  title: string
}

export interface StoryWovenPayload {
  projectId: string
  versionNumber: number
  fragmentCount: number
  cost: number
}

export interface CommentCreatedPayload {
  commentId: string
  memberId: string
  fragmentId?: string
  projectId?: string
  content: string
}

export interface ReactionAddedPayload {
  reactionId: string
  memberId: string
  fragmentId: string
  reactionType: string
}

export interface MemberJoinedPayload {
  memberId: string
  communityId: string
  username: string
}

export interface CollaboratorAddedPayload {
  projectId: string
  memberId: string
  role: string
}
