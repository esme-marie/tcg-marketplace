/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images : {
    domains : ['localhost', 'images.pokemontcg.io'] // <== Domain name
  }
}

module.exports = nextConfig
