import { mockProvider } from './mock.js'
import { openaiProvider } from './openai.js'

export const getProvider = (settings) => (settings.provider === 'openai' ? openaiProvider(settings) : mockProvider)
