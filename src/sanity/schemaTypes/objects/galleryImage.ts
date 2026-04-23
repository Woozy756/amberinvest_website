import {defineField, defineType} from 'sanity'

export const galleryImageType = defineType({
  name: 'galleryImage',
  title: 'Galerijas attēls',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Attēls',
      type: 'image',
      options: {hotspot: true},
      description: 'Nav obligāts. Lai notīrītu lauku, noņem attēlu.',
    }),
    defineField({
      name: 'alt',
      title: 'Alt teksts',
      type: 'string',
      description: 'Ieteicams aizpildīt, ja ir pievienots attēls.',
    }),
    defineField({
      name: 'label',
      title: 'Etiķete',
      type: 'string',
    }),
    defineField({
      name: 'orientation',
      title: 'Orientācija',
      type: 'string',
      options: {
        list: [
          {title: 'Horizontāls', value: 'landscape'},
          {title: 'Vertikāls', value: 'portrait'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'alt',
      media: 'image',
    },
  },
})
