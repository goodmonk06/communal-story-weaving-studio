import { logger } from './logger'

export interface MetricLabels {
  [key: string]: string | number | boolean
}

class MetricsCollector {
  private counters: Map<string, number> = new Map()
  private gauges: Map<string, number> = new Map()
  private histograms: Map<string, number[]> = new Map()

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, labels?: MetricLabels, value: number = 1) {
    const key = this.buildKey(name, labels)
    const current = this.counters.get(key) || 0
    this.counters.set(key, current + value)

    logger.debug({ metric: name, value, labels }, 'Counter incremented')
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, value: number, labels?: MetricLabels) {
    const key = this.buildKey(name, labels)
    this.gauges.set(key, value)

    logger.debug({ metric: name, value, labels }, 'Gauge set')
  }

  /**
   * Record a histogram value
   */
  recordHistogram(name: string, value: number, labels?: MetricLabels) {
    const key = this.buildKey(name, labels)
    const values = this.histograms.get(key) || []
    values.push(value)
    this.histograms.set(key, values)

    logger.debug({ metric: name, value, labels }, 'Histogram recorded')
  }

  /**
   * Record timing for an operation
   */
  async recordTiming<T>(
    name: string,
    operation: () => Promise<T>,
    labels?: MetricLabels
  ): Promise<T> {
    const start = Date.now()
    try {
      const result = await operation()
      const duration = Date.now() - start
      this.recordHistogram(`${name}.duration_ms`, duration, labels)
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.recordHistogram(`${name}.duration_ms`, duration, { ...labels, error: 'true' })
      throw error
    }
  }

  /**
   * Get current metrics snapshot
   */
  getSnapshot() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, values]) => [
          key,
          this.calculateHistogramStats(values),
        ])
      ),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.counters.clear()
    this.gauges.clear()
    this.histograms.clear()
  }

  private buildKey(name: string, labels?: MetricLabels): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name
    }
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',')
    return `${name}{${labelStr}}`
  }

  private calculateHistogramStats(values: number[]) {
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    const count = values.length

    return {
      count,
      sum,
      avg: sum / count,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    }
  }
}

// Singleton instance
export const metrics = new MetricsCollector()

// Convenience functions
export const incrementCounter = metrics.incrementCounter.bind(metrics)
export const setGauge = metrics.setGauge.bind(metrics)
export const recordHistogram = metrics.recordHistogram.bind(metrics)
export const recordTiming = metrics.recordTiming.bind(metrics)
export const getMetricsSnapshot = metrics.getSnapshot.bind(metrics)
