// nuxt.config.js

const config = require('./.contentful.json')

const contentful = require('contentful')
const client = contentful.createClient({
  space: config.CTF_SPACE_ID,
  accessToken: config.CTF_CDA_ACCESS_TOKEN
})

module.exports = {
  // 
  env: {
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN
  }
  modules: [
    '@nuxtjs/markdownit'
  ],
  plugins: [
    '~/plugins/vue2-filters'
  ], 
  markdownit: { 
    html: true,
    injected: true,
    linkify: true,
    breaks: false
  },
  generate: {
    routes () {
      return Promise.all([
        client.getEntries({
          'content_type': 'post'
        }),
        client.getEntries({
          'content_type': 'category'
        }),
        client.getEntries({
          'content_type': 'tag'
        })
      ]).then(([posts,categories,tags]) => {
        return [
          ...posts.items.map(post => `posts/${post.fields.slug}`),
          ...categories.items.map(category => `posts/category/${category.fields.slug}`),
          ...tags.items.map(tag => `posts/tag/${tag.fields.slug}`)
        ]
      })
    }
  }
  // ...
}