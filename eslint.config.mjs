import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextCoreWebVitals,
  // This repo contains a number of intentional patterns (async loaders, UI state resets)
  // that trip newer React Hooks lint rules. Keep lint useful without blocking CI.
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
]

export default config

