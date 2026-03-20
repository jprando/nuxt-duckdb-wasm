// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Desabilitadas para evitar conflito com dprint, que formata union/intersection
    // types e operadores de atribuição com layout diferente do esperado pelo @stylistic
    '@stylistic/indent-binary-ops': 'off',
    '@stylistic/operator-linebreak': 'off'
  }
})
