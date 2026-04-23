import {defineField, defineType} from 'sanity'
import {contactPageDefaults} from '../../contactPageDefaults'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Kontaktu lapa',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Kontaktu ievads', default: true},
    {name: 'form', title: 'Forma'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Iekšējais nosaukums',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEyebrow',
      title: 'Kontaktu sadaļas virsraksta rinda',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactTitle',
      title: 'Kontaktu sadaļas virsraksts',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactLead',
      title: 'Kontaktu sadaļas apraksts',
      type: 'text',
      rows: 5,
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactHighlights',
      title: 'Kontaktu akcenti',
      type: 'array',
      group: 'contact',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(2).max(4),
    }),
    defineField({
      name: 'formEyebrow',
      title: 'Formas sadaļas virsraksta rinda',
      type: 'string',
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formTitle',
      title: 'Formas sadaļas virsraksts',
      type: 'string',
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formLead',
      title: 'Formas sadaļas apraksts',
      type: 'text',
      rows: 5,
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formCardTitle',
      title: 'Formas kartītes virsraksts',
      type: 'string',
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formCardIntro',
      title: 'Formas kartītes ievadteksts',
      type: 'text',
      rows: 4,
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'defaultInformation',
      title: 'Noklusējuma informācijas ziņa',
      type: 'string',
      group: 'form',
      description: 'Aizpilda informācijas lauku kontaktformā.',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Iesniegšanas pogas teksts',
      type: 'string',
      group: 'form',
      validation: (rule) => rule.required(),
    }),
  ],
  initialValue: contactPageDefaults,
  preview: {
    select: {
      title: 'title',
      subtitle: 'contactTitle',
    },
  },
})
