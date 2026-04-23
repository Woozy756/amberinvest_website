import {defineField, defineType} from 'sanity'

export const projectDocument = defineType({
  name: 'project',
  title: 'Projekts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nosaukums',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Pilsēta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Adrese',
      type: 'string',
      description: 'Tiek izmantota kartes meklēšanas vaicājumā kopā ar pilsētu.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      city: 'city',
      address: 'address',
    },
    prepare({title, city, address}) {
      const subtitle = [city, address].filter(Boolean).join(' • ')
      return {
        title,
        subtitle,
      }
    },
  },
})
