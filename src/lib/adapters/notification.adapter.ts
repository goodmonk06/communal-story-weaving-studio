/**
 * Notification Adapter Interface
 * Allows plugging in different notification providers (email, SMS, push, webhooks)
 */

export interface NotificationPayload {
  to: string | string[]
  subject?: string
  message: string
  data?: Record<string, any>
  priority?: 'low' | 'normal' | 'high'
}

export interface INotificationAdapter {
  /**
   * Send a notification
   */
  send(payload: NotificationPayload): Promise<void>

  /**
   * Send multiple notifications in batch
   */
  sendBatch(payloads: NotificationPayload[]): Promise<void>
}

/**
 * Console notification adapter for development
 */
export class ConsoleNotificationAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<void> {
    console.log('[Notification]', JSON.stringify(payload, null, 2))
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    console.log('[Notification Batch]', JSON.stringify(payloads, null, 2))
  }
}

/**
 * No-op notification adapter for testing
 */
export class NoOpNotificationAdapter implements INotificationAdapter {
  async send(_payload: NotificationPayload): Promise<void> {
    // Do nothing
  }

  async sendBatch(_payloads: NotificationPayload[]): Promise<void> {
    // Do nothing
  }
}

// Default adapter (can be configured via DI)
let currentAdapter: INotificationAdapter = new ConsoleNotificationAdapter()

export function setNotificationAdapter(adapter: INotificationAdapter) {
  currentAdapter = adapter
}

export function getNotificationAdapter(): INotificationAdapter {
  return currentAdapter
}

// Convenience functions
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  return currentAdapter.send(payload)
}

export async function sendNotificationBatch(payloads: NotificationPayload[]): Promise<void> {
  return currentAdapter.sendBatch(payloads)
}
