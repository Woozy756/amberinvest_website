import {defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Lapa',
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
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Lapas tips',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Par mums', value: 'about-us'},
          {title: 'Kā iegādāties', value: 'how-to-buy'},
          {title: 'Kontakti', value: 'contact'},
          {title: 'Pielāgota', value: 'custom'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Ievada virsraksta rinda',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Ievada virsraksts',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroLead',
      title: 'Ievada apraksts',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Ievada attēls',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
    }),
    defineField({
      name: 'body',
      title: 'Saturs',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
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
      subtitle: 'pageType',
      media: 'heroImage',
    },
  },
})
