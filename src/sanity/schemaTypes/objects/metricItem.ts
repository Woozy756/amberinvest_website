import {defineField, defineType} from 'sanity'

export const metricItemType = defineType({
  name: 'metricItem',
  title: 'Rādītāja ieraksts',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Nosaukums',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Vērtība',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'value',
    },
  },
})
