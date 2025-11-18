/**
 * Analytics Adapter Interface
 * Track events and user behavior for analytics platforms
 */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: Date
}

export interface IAnalyticsAdapter {
  /**
   * Track an event
   */
  track(event: AnalyticsEvent): Promise<void>

  /**
   * Identify a user
   */
  identify(userId: string, traits?: Record<string, any>): Promise<void>

  /**
   * Track a page view
   */
  page(name: string, properties?: Record<string, any>): Promise<void>
}

/**
 * Console analytics adapter for development
 */
export class ConsoleAnalyticsAdapter implements IAnalyticsAdapter {
  async track(event: AnalyticsEvent): Promise<void> {
    console.log('[Analytics] Event:', event.name, event.properties)
  }

  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    console.log('[Analytics] Identify:', userId, traits)
  }

  async page(name: string, properties?: Record<string, any>): Promise<void> {
    console.log('[Analytics] Page:', name, properties)
  }
}

/**
 * No-op analytics adapter for testing
 */
export class NoOpAnalyticsAdapter implements IAnalyticsAdapter {
  async track(_event: AnalyticsEvent): Promise<void> {
    // Do nothing
  }

  async identify(_userId: string, _traits?: Record<string, any>): Promise<void> {
    // Do nothing
  }

  async page(_name: string, _properties?: Record<string, any>): Promise<void> {
    // Do nothing
  }
}

// Global adapter
let currentAdapter: IAnalyticsAdapter = new ConsoleAnalyticsAdapter()

export function setAnalyticsAdapter(adapter: IAnalyticsAdapter) {
  currentAdapter = adapter
}

export function getAnalyticsAdapter(): IAnalyticsAdapter {
  return currentAdapter
}

// Convenience functions
export async function trackEvent(name: string, properties?: Record<string, any>, userId?: string): Promise<void> {
  return currentAdapter.track({ name, properties, userId, timestamp: new Date() })
}

export async function identifyUser(userId: string, traits?: Record<string, any>): Promise<void> {
  return currentAdapter.identify(userId, traits)
}

export async function trackPageView(name: string, properties?: Record<string, any>): Promise<void> {
  return currentAdapter.page(name, properties)
}
