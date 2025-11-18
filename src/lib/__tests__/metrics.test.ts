import { describe, it, expect, beforeEach } from 'vitest'
import { metrics, incrementCounter, setGauge, recordHistogram, recordTiming } from '../metrics'

describe('Metrics', () => {
  beforeEach(() => {
    metrics.reset()
  })

  describe('incrementCounter', () => {
    it('should increment a counter', () => {
      incrementCounter('test.counter')
      incrementCounter('test.counter')
      incrementCounter('test.counter', {}, 3)

      const snapshot = metrics.getSnapshot()
      expect(snapshot.counters['test.counter']).toBe(5)
    })

    it('should handle labeled counters', () => {
      incrementCounter('test.counter', { method: 'GET' })
      incrementCounter('test.counter', { method: 'POST' })
      incrementCounter('test.counter', { method: 'GET' })

      const snapshot = metrics.getSnapshot()
      expect(snapshot.counters['test.counter{method="GET"}']).toBe(2)
      expect(snapshot.counters['test.counter{method="POST"}']).toBe(1)
    })
  })

  describe('setGauge', () => {
    it('should set a gauge value', () => {
      setGauge('test.gauge', 42)
      setGauge('test.gauge', 100)

      const snapshot = metrics.getSnapshot()
      expect(snapshot.gauges['test.gauge']).toBe(100)
    })

    it('should handle labeled gauges', () => {
      setGauge('memory.usage', 1024, { process: 'worker1' })
      setGauge('memory.usage', 2048, { process: 'worker2' })

      const snapshot = metrics.getSnapshot()
      expect(snapshot.gauges['memory.usage{process="worker1"}']).toBe(1024)
      expect(snapshot.gauges['memory.usage{process="worker2"}']).toBe(2048)
    })
  })

  describe('recordHistogram', () => {
    it('should record histogram values and calculate stats', () => {
      recordHistogram('request.duration', 100)
      recordHistogram('request.duration', 200)
      recordHistogram('request.duration', 150)

      const snapshot = metrics.getSnapshot()
      const stats = snapshot.histograms['request.duration']

      expect(stats).toBeDefined()
      expect(stats?.count).toBe(3)
      expect(stats?.sum).toBe(450)
      expect(stats?.avg).toBe(150)
      expect(stats?.min).toBe(100)
      expect(stats?.max).toBe(200)
    })
  })

  describe('recordTiming', () => {
    it('should record timing for successful operations', async () => {
      await recordTiming('operation', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return 'success'
      })

      const snapshot = metrics.getSnapshot()
      const stats = snapshot.histograms['operation.duration_ms']

      expect(stats).toBeDefined()
      expect(stats?.count).toBe(1)
      expect(stats?.min).toBeGreaterThan(0)
    })

    it('should record timing for failed operations with error label', async () => {
      try {
        await recordTiming('failing-operation', async () => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          throw new Error('Failed')
        })
      } catch (error) {
        // Expected to throw
      }

      const snapshot = metrics.getSnapshot()
      const stats = snapshot.histograms['failing-operation.duration_ms{error="true"}']

      expect(stats).toBeDefined()
      expect(stats?.count).toBe(1)
    })
  })

  describe('getSnapshot', () => {
    it('should return a snapshot of all metrics', () => {
      incrementCounter('counter1')
      setGauge('gauge1', 42)
      recordHistogram('histogram1', 100)

      const snapshot = metrics.getSnapshot()

      expect(snapshot.counters).toHaveProperty('counter1')
      expect(snapshot.gauges).toHaveProperty('gauge1')
      expect(snapshot.histograms).toHaveProperty('histogram1')
      expect(snapshot.timestamp).toBeDefined()
    })
  })
})
