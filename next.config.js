/** @type {import('next').NextConfig} */
const fs = require('node:fs')
const path = require('node:path')
const lab = require('./scripts/lab-launcher.cjs')
const isolatedCopy = fs.existsSync(path.join(__dirname, lab.MARKER))
const laboratory = process.env.NEXT_PUBLIC_TCE_LAB_MODE === 'true'
if (isolatedCopy || laboratory) {
  lab.validateRuntime(process.env)
  // Service startup is outside this intervention: no HTTPS/egress controls
  // have been accredited yet. Even raw `next dev` in the copy must fail closed.
  throw new Error('LAB_SERVICES_NOT_AUTHORIZED')
}
const nextConfig = {}

module.exports = nextConfig
