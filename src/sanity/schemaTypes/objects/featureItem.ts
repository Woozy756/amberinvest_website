import {defineField, defineType} from 'sanity'

export const featureItemType = defineType({
  name: 'featureItem',
  title: 'Priekšrocības ieraksts',
  type: 'object',
  fields: [
    defineField({
      name: 'iconSvg',
      title: 'SVG ikona',
      type: 'file',
      options: {
        accept: 'image/svg+xml',
      },
      description: 'Augšupielādē vienu SVG failu. Ieteicams vienkāršs ikonas dizains (ap 24x24).',
    }),
    defineField({
      name: 'title',
      title: 'Nosaukums',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Apraksts',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'iconSvg.originalFilename',
    },
  },
})
