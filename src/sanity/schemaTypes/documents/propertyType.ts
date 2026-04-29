import {defineField, defineType} from 'sanity'

export const propertyTypeDocument = defineType({
  name: 'propertyType',
  title: 'Īpašuma filtrs',
  type: 'document',
  groups: [
    {name: 'content', title: 'Saturs', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nosaukums',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Saīsne (slug)',
      type: 'slug',
      description: 'Izmanto filtru URL, piemēram: /properties/divistabu.',
      options: {source: 'title', maxLength: 96},
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortLabel',
      title: 'Īsā etiķete',
      type: 'string',
      description: 'Tiek rādīta kompaktajās filtru cilnēs.',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Filtra apraksts',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortLabel',
    },
  },
})
