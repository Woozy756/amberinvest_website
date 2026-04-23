import {defineField, defineType} from 'sanity'

const initialIntroParagraphs = [
  'AmberInvest ir uzticams partneris nekustamo īpašumu tirdzniecībā, kas palīdz klientiem atrast labākos risinājumus dzīvesvietai, investīcijām un biznesa attīstībai. Mēs apvienojam tirgus zināšanas, individuālu pieeju un augstus kvalitātes standartus, lai katrs darījums būtu drošs, pārdomāts un veiksmīgs.',
  'Mūsu specializācija ir dzīvojamo, komerciālo un investīciju īpašumu pārdošana un iegāde. Mēs strādājam ar mērķi ne tikai atrast piemērotu īpašumu, bet arī radīt klientiem pārliecību visā darījuma procesā — no pirmās konsultācijas līdz līguma noslēgšanai.',
  'AmberInvest komanda tic caurspīdīgai sadarbībai, godīgai komunikācijai un ilgtermiņa attiecībām ar klientiem. Mēs saprotam, ka nekustamais īpašums ir viens no nozīmīgākajiem dzīves un biznesa lēmumiem, tāpēc katrai situācijai pieejam ar atbildību, precizitāti un rūpēm.',
]

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'Par mums lapa',
  type: 'document',
  groups: [
    {name: 'intro', title: 'Par mums', default: true},
    {name: 'values', title: 'Vērtības'},
    {name: 'missionVision', title: 'Misija un redzējums'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Iekšējais nosaukums',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introEyebrow',
      title: 'Ievada virsraksta rinda',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introTitle',
      title: 'Ievada virsraksts',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introParagraphs',
      title: 'Ievada rindkopas',
      type: 'array',
      group: 'intro',
      of: [{type: 'text'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'valuesEyebrow',
      title: 'Vērtību virsraksta rinda',
      type: 'string',
      group: 'values',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'valuesTitle',
      title: 'Vērtību virsraksts',
      type: 'string',
      group: 'values',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'values',
      title: 'Vērtību saraksts',
      type: 'array',
      group: 'values',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'missionEyebrow',
      title: 'Misijas virsraksta rinda',
      type: 'string',
      group: 'missionVision',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionText',
      title: 'Misijas teksts',
      type: 'text',
      rows: 4,
      group: 'missionVision',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visionEyebrow',
      title: 'Redzējuma virsraksta rinda',
      type: 'string',
      group: 'missionVision',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visionText',
      title: 'Redzējuma teksts',
      type: 'text',
      rows: 4,
      group: 'missionVision',
      validation: (rule) => rule.required(),
    }),
  ],
  initialValue: {
    title: 'Par mums',
    introEyebrow: 'Par mums',
    introTitle: 'AmberInvest ir uzticams partneris nekustamo īpašumu tirdzniecībā.',
    introParagraphs: initialIntroParagraphs,
    valuesEyebrow: 'Mūsu vērtības',
    valuesTitle: 'Principi, uz kuriem balstām ikvienu sadarbību.',
    values: [
      'Profesionalitāte un uzticamība',
      'Individuāla pieeja katram klientam',
      'Tirgus izpratne un stratēģisks skatījums',
      'Drošs un pārskatāms darījuma process',
    ],
    missionEyebrow: 'Mūsu misija',
    missionText:
      'Palīdzēt klientiem pieņemt gudrus un izdevīgus lēmumus nekustamo īpašumu tirgū, piedāvājot kvalitatīvu servisu un stabilu atbalstu katrā sadarbības posmā.',
    visionEyebrow: 'Mūsu redzējums',
    visionText:
      'Būt par atpazīstamu un uzticamu nekustamo īpašumu uzņēmumu, kas asociējas ar kvalitāti, profesionālu attieksmi un veiksmīgiem rezultātiem.',
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'introTitle',
    },
  },
})
