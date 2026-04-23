import type {StructureResolver} from 'sanity/structure'

import {singletonTypes} from './singletons'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Saturs')
    .items([
      S.listItem()
        .title('Sākumlapa')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Vietnes iestatījumi')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Kā iegādāties lapa')
        .child(S.document().schemaType('howToBuyPage').documentId('howToBuyPageClean')),
      S.listItem()
        .title('Par mums lapa')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Kontaktu lapa')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.divider(),
      S.listItem().title('Īpašumi').child(S.documentTypeList('property').title('Īpašumi')),
      S.listItem()
        .title('Īpašumu filtri')
        .child(S.documentTypeList('propertyType').title('Īpašumu filtri')),
      S.listItem().title('Projekti').child(S.documentTypeList('project').title('Projekti')),
      S.listItem().title('Lapas').child(S.documentTypeList('page').title('Lapas')),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return (
          Boolean(id) &&
          !singletonTypes.has(id) &&
          !['property', 'propertyType', 'project', 'page'].includes(id)
        )
      }),
    ])
