// stylelint.config.js
export default {
    extends: ['stylelint-config-recommended'],
    rules: {
      'at-rule-no-unknown': [
        true,
        {
          ignoreAtRules: [
            'tailwind',
            'apply',
            'variants',
            'responsive',
            'screen',
            'layer'
          ],
        },
      ],
      'no-descending-specificity': null,
      'font-family-no-missing-generic-family-keyword': null,
    },
  }