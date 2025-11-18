import { describe, it, expect, beforeEach } from 'vitest'
import {
  MockAIAdapter,
  setAIProvider,
  getAIProvider,
  generateAI,
} from '../adapters/ai-provider.adapter'
import {
  NoOpNotificationAdapter,
  setNotificationAdapter,
  sendNotification,
} from '../adapters/notification.adapter'
import {
  NoOpStorageAdapter,
  setStorageAdapter,
  getStorageAdapter,
} from '../adapters/storage.adapter'
import {
  NoOpAnalyticsAdapter,
  setAnalyticsAdapter,
  trackEvent,
} from '../adapters/analytics.adapter'

describe('Adapters', () => {
  describe('AI Provider Adapter', () => {
    beforeEach(() => {
      setAIProvider(new MockAIAdapter('Test response'))
    })

    it('should generate AI response', async () => {
      const result = await generateAI({
        prompt: 'Test prompt',
        systemPrompt: 'You are a helpful assistant',
        temperature: 0.7,
      })

      expect(result.text).toBe('Test response')
      expect(result.model).toBe('mock-model')
      expect(result.usage.totalTokens).toBeGreaterThan(0)
      expect(result.cost).toBe(0)
    })

    it('should get provider name and models', () => {
      const provider = getAIProvider()

      expect(provider.getName()).toBe('mock')
      expect(provider.getAvailableModels()).toContain('mock-model')
    })

    it('should allow setting custom mock response', async () => {
      const mockAdapter = new MockAIAdapter()
      mockAdapter.setMockResponse('Custom response')
      setAIProvider(mockAdapter)

      const result = await generateAI({ prompt: 'Test' })

      expect(result.text).toBe('Custom response')
    })
  })

  describe('Notification Adapter', () => {
    beforeEach(() => {
      setNotificationAdapter(new NoOpNotificationAdapter())
    })

    it('should send notification without throwing', async () => {
      await expect(
        sendNotification({
          to: 'user@example.com',
          subject: 'Test',
          message: 'Hello',
        })
      ).resolves.not.toThrow()
    })

    it('should send batch notifications', async () => {
      const adapter = new NoOpNotificationAdapter()

      await expect(
        adapter.sendBatch([
          { to: 'user1@example.com', message: 'Hello 1' },
          { to: 'user2@example.com', message: 'Hello 2' },
        ])
      ).resolves.not.toThrow()
    })
  })

  describe('Storage Adapter', () => {
    beforeEach(() => {
      setStorageAdapter(new NoOpStorageAdapter())
    })

    it('should upload file', async () => {
      const adapter = getStorageAdapter()
      const result = await adapter.upload('test content', {
        filename: 'test.txt',
        contentType: 'text/plain',
      })

      expect(result.key).toContain('test.txt')
      expect(result.url).toBeDefined()
      expect(result.size).toBe(0)
    })

    it('should get public URL', () => {
      const adapter = getStorageAdapter()
      const url = adapter.getPublicUrl('test-file.jpg')

      expect(url).toContain('test-file.jpg')
    })

    it('should delete file without throwing', async () => {
      const adapter = getStorageAdapter()

      await expect(adapter.delete('test-key')).resolves.not.toThrow()
    })
  })

  describe('Analytics Adapter', () => {
    beforeEach(() => {
      setAnalyticsAdapter(new NoOpAnalyticsAdapter())
    })

    it('should track events without throwing', async () => {
      await expect(
        trackEvent('fragment.created', {
          fragmentId: '123',
          memberId: 'user1',
        })
      ).resolves.not.toThrow()
    })

    it('should identify user without throwing', async () => {
      const adapter = new NoOpAnalyticsAdapter()

      await expect(
        adapter.identify('user123', {
          email: 'user@example.com',
          name: 'Test User',
        })
      ).resolves.not.toThrow()
    })

    it('should track page views without throwing', async () => {
      const adapter = new NoOpAnalyticsAdapter()

      await expect(
        adapter.page('Home Page', {
          path: '/',
          referrer: 'google.com',
        })
      ).resolves.not.toThrow()
    })
  })
})
