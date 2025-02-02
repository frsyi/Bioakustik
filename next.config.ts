/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  trailingSlash: true,
  env: {
    BASE_URL: process.env.NODE_ENV == "production" ? "/api" : "/api",
  },
}
