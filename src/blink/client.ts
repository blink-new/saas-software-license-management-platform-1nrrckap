import { createClient } from '@blinkdotnew/sdk'

console.log('Initializing Blink client...')

export const blink = createClient({
  projectId: 'saas-software-license-management-platform-1nrrckap',
  authRequired: true
})

console.log('Blink client initialized successfully')

// Test the client initialization
console.log('Blink client ready for authentication')