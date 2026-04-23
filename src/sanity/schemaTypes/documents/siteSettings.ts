import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Vietnes iestatījumi',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Zīmols', default: true},
    {name: 'contact', title: 'Kontakti'},
    {name: 'navigation', title: 'Navigācija'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Vietnes nosaukums',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logotips',
      type: 'image',
      group: 'brand',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt teksts',
          type: 'string',
          description: 'Izmanto piekļūstamībai, kad logotips tiek rādīts galvenē.',
        }),
      ],
    }),
    defineField({
      name: 'footerTitle',
      title: 'Kājenes virsraksts',
      type: 'string',
      group: 'brand',
      description: 'Galvenais virsraksts kājenes zīmola blokā.',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Kājenes apraksts',
      type: 'text',
      rows: 4,
      group: 'brand',
      description: 'Papildteksts zem kājenes virsraksta.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Kontaktu e-pasts',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Tālrunis',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Adrese',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'businessHours',
      title: 'Darba laiks',
      type: 'string',
      group: 'contact',
      description: 'Rādās kājenes kontaktu sarakstā (piemēram: P.-Pk. 09:00-18:00).',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Sociālie tīkli',
      type: 'array',
      group: 'contact',
      of: [{type: 'socialLink'}],
    }),
    defineField({
      name: 'headerNavigation',
      title: 'Galvenes navigācija',
      type: 'array',
      group: 'navigation',
      of: [{type: 'cta'}],
    }),
    defineField({
      name: 'footerNavigation',
      title: 'Kājenes navigācija',
      type: 'array',
      group: 'navigation',
      of: [{type: 'cta'}],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Noklusējuma SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      subtitle: 'footerTitle',
      media: 'logo',
    },
  },
})
