const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `
      @use "@/styles/variables" as *;
      @use "@/styles/mixins" as *;
    `,
  },
}

module.exports = nextConfig
