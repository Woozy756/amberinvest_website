import {defineField, defineType} from 'sanity'

export const howToBuyFaqItemType = defineType({
  name: 'howToBuyFaqItem',
  title: 'Kā iegādāties FAQ ieraksts',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Jautājums',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Atbilde',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
    prepare(selection) {
      const subtitle = typeof selection.subtitle === 'string' ? selection.subtitle : ''

      return {
        title: selection.title,
        subtitle: subtitle.length > 84 ? `${subtitle.slice(0, 81)}...` : subtitle,
      }
    },
  },
})
