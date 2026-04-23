import {defineField, defineType} from 'sanity'

export const howToBuyStepType = defineType({
  name: 'howToBuyStep',
  title: 'Kā iegādāties solis',
  type: 'object',
  fields: [
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
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'supportingNote',
      title: 'Papildu piezīme',
      type: 'string',
      description: 'Īsa papildpiezīme, kas tiek rādīta zem soļa apraksta.',
    }),
    defineField({
      name: 'image',
      title: 'Attēls',
      type: 'galleryImage',
      description: 'Papildu attēls šim solim (nav obligāts).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'supportingNote',
      media: 'image.image',
    },
  },
})
