import type { NextConfig } from 'next'
import { withVercelToolbar } from '@vercel/toolbar/plugins/next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default withVercelToolbar()(nextConfig)
