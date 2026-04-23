import {defineField, defineType} from 'sanity'

export const ctaType = defineType({
  name: 'cta',
  title: 'Poga/saite',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiķete',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Saite',
      type: 'string',
      description: 'Lieto iekšējās adreses, piemēram, /properties, vai pilnas URL adreses.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
})
