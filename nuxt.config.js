
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  //mode: 'universal', // It's deprecated, use ssr instead
  ssr: true, // default value

  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      //{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/index.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/element-ui',
    // There is no need server side rendering and render it only on client side
    { src: '@/plugins/socket', ssr: false },
    // EventBus registration
    '@/plugins/eventBus',
    '@/plugins/axios-handler',
    { src: '@/plugins/pages-menu-recursive', mode: 'client'  },
    { src: '~/plugins/user-role' },
    { src: '~/plugins/admin-settings' }
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    "@nuxtjs/vuetify",
  ],

  /*
  ** Nuxt.js Vuetify options
  */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    optionsPath: "./vuetify.options.js"
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    '@nuxtjs/axios',
    '@nuxtjs/markdownit'
  ],

  /*
  ** Axios Nuxt.js
  */
  axios: {
    // proxyHeaders: false
  },

  /*
  ** Mark Down Nuxt.js
  */
  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    injected: true,
    preset: 'default',
    linkify: true,
    breaks: true,
    html: true,
    typographer: true
  },

  /*
  ** Server Middleware
  */
  serverMiddleware: [
    { path: '/api', handler: '~/api' }
  ],

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
