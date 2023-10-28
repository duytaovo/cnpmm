/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      // colors: {
      //   orange: '#ee4d2d'
      // },
      backgroundImage: {
        mainColor: 'linear-gradient(70deg,#44c5e5,#276dc1)',
        shareACar:
          "url('https://assets-global.website-files.com/5c16e90c8f6920b098f834e5/63d8276f5f590e8cd734e67c_shareacar2tiny.jpg')",
        bannerComunity:
          "url('https://assets-global.website-files.com/5c19140f997c250869180aa0/642c5727f0b7763cbb82c314_onboardbonus.png')"
      },
      colors: {
        orange: '#3699d3',
        main: '#3699d3',
        textMainColor: '#333333',
        textCustom: '#ffffff99',
        textCustomBgWhite: '#727171',
        mainL1: '#1f4160',
        'white-main': '#f9f8f8'
      },
      backgroundColor: {
        mainBackGroundColor: '#1c2635',
        bgHeaderMobile: 'rgb(249 248 248 / 80%)'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    }),
    require('@tailwindcss/line-clamp')
  ]
}
