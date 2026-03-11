import { describe, expect, it } from 'vitest'

import { createTranslator, normalizeLocale, resolveInitialLocale } from './index'
import { messages } from './messages'

describe('normalizeLocale', () => {
  it('normalizes supported locales', () => {
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('id')).toBe('id')
    expect(normalizeLocale('zh')).toBe('zh-CN')
    expect(normalizeLocale('zh-CN')).toBe('zh-CN')
  })

  it('falls back to english for invalid locales', () => {
    expect(normalizeLocale('fr')).toBe('en')
    expect(normalizeLocale('')).toBe('en')
    expect(normalizeLocale(undefined)).toBe('en')
  })
})

describe('resolveInitialLocale', () => {
  it('prefers persisted locale over runtime locale', () => {
    expect(resolveInitialLocale('id', 'en')).toBe('id')
  })

  it('uses runtime locale when persisted locale is invalid', () => {
    expect(resolveInitialLocale('fr', 'zh')).toBe('zh-CN')
  })
})

describe('createTranslator', () => {
  it('returns localized messages', () => {
    const t = createTranslator('id')
    expect(t('app.auth.submit')).toBe('Buka console admin')
    expect(t('channels.empty.title')).toBe('Belum ada channel')
  })

  it('falls back to english for missing locale entries', () => {
    const t = createTranslator('id')
    expect(t('app.tabs.chat')).toBe('OpenAI Chat')
  })

  it('returns the key when the message is unknown', () => {
    const t = createTranslator('en')
    expect((t as unknown as (key: string) => string)('missing.key')).toBe('missing.key')
  })
})

describe('messages', () => {
  it('includes orchestration and add-channel keys for all locales', () => {
    const requiredKeys = [
      'orchestration.title',
      'orchestration.multiChannel',
      'orchestration.singleChannel',
      'orchestration.searchPlaceholder',
      'orchestration.failoverSequence',
      'orchestration.dragHint',
      'orchestration.logs',
      'orchestration.edit',
      'orchestration.copyConfig',
      'orchestration.enable',
      'orchestration.delete',
      'addChannel.editTitle',
      'addChannel.createTitle',
      'addChannel.editSubtitle',
      'addChannel.quickSubtitle',
      'addChannel.fullSubtitle',
      'addChannel.testCapability',
      'addChannel.detailedMode',
      'addChannel.quickMode',
      'chart.close',
      'chart.1h',
      'chart.6h',
      'chart.24h',
      'chart.today',
      'chart.traffic',
      'chart.tokens',
      'chart.cacheRw',
      'chart.noRequestsInRange',
      'chart.noKeyUsageInRange',
    ] as const

    for (const locale of Object.keys(messages) as Array<keyof typeof messages>) {
      for (const key of requiredKeys) {
        expect(messages[locale][key as keyof (typeof messages)[typeof locale]]).toBeTruthy()
      }
    }
  })
})
