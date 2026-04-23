import {defineField, defineType} from 'sanity'

export const propertyTypeDocument = defineType({
  name: 'propertyType',
  title: 'Īpašuma filtrs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nosaukums',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Saīsne (slug)',
      type: 'slug',
      description: 'Izmanto filtru URL, piemēram: /properties/divistabu.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortLabel',
      title: 'Īsā etiķete',
      type: 'string',
      description: 'Tiek rādīta kompaktajās filtru cilnēs.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Filtra apraksts',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortLabel',
    },
  },
})
