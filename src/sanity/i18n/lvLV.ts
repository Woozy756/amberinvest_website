import {
  defineLocale,
  defineLocaleResourceBundle,
  type LocaleResourceBundle,
  usEnglishLocale,
} from 'sanity'

const englishFallbackBundles: Array<Omit<LocaleResourceBundle, 'locale'>> = (
  usEnglishLocale.bundles ?? []
).map((bundle) => {
  const {locale: _locale, ...rest} = bundle as LocaleResourceBundle
  return rest
})

export const lvLVLocale = defineLocale({
  id: 'lv-LV',
  title: 'Latviešu',
  weekInfo: {
    firstDay: 1,
    weekend: [6, 7],
  },
  bundles: englishFallbackBundles,
})

const studioBundle = defineLocaleResourceBundle({
  locale: 'lv-LV',
  namespace: 'studio',
  resources: {
    'search.action-open-aria-label': 'Atvērt meklēšanu',
    'search.action.add-filter': 'Pievienot filtru',
    'search.action.clear-filters': 'Notīrīt filtrus',
    'search.action.clear-recent-searches': 'Notīrīt nesenos meklējumus',
    'search.action.clear-type-filters-aria-label': 'Notīrīt atlasītos filtrus',
    'search.action.clear-type-filters-label': 'Notīrīt',
    'search.action.close-search-aria-label': 'Aizvērt meklēšanu',
    'search.action.filter-by-document-type-aria-label': 'Filtrēt pēc dokumenta tipa',
    'search.action.remove-filter-aria-label': 'Noņemt filtru',
    'search.action.search-all-types': 'Meklēt visos dokumentos',
    'search.action.search-specific-types': 'Meklēt: {{types, list}}',
    'search.action.search-specific-types-truncated': 'Meklēt: {{types, list}} +{{count}} vēl',
    'search.action.select-asset': 'Izvēlēties failu',
    'search.action.select-asset_file': 'Izvēlēties failu',
    'search.action.select-asset_image': 'Izvēlēties attēlu',
    'search.action.toggle-filters-aria-label_hide': 'Paslēpt filtrus',
    'search.action.toggle-filters-aria-label_show': 'Rādīt filtrus',
    'search.action.toggle-filters-label_hide': 'Paslēpt filtrus',
    'search.action.toggle-filters-label_show': 'Rādīt filtrus',
    'search.button.tooltip': 'Meklēt',
    'search.document-type-list-all-types': 'Visi tipi',
    'search.document-types-aria-label': 'Dokumentu tipi',
    'search.document-types-no-matches-found': 'Nav atbilstību: {{filter}}',
    'search.filter-all-fields-header': 'Visi lauki',
    'search.filter-asset-change_file': 'Mainīt failu',
    'search.filter-asset-change_image': 'Mainīt attēlu',
    'search.filter-asset-clear': 'Notīrīt',
    'search.filter-asset-select_file': 'Izvēlēties failu',
    'search.filter-asset-select_image': 'Izvēlēties attēlu',
    'search.filter-boolean-false': 'Nē',
    'search.filter-boolean-true': 'Jā',
    'search.filter-by-title-aria-label': 'Filtrēt pēc nosaukuma',
    'search.filter-date-aria-label': 'Datums',
    'search.filter-date-range-end-date-aria-label': 'Beigu datums',
    'search.filter-date-range-start-date-aria-label': 'Sākuma datums',
    'search.filter-date-unit-aria-label': 'Izvēlēties vienību',
    'search.filter-date-unit_days': 'Dienas',
    'search.filter-date-unit_months': 'Mēneši',
    'search.filter-date-unit_years': 'Gadi',
    'search.filter-date-value-aria-label': 'Vienības vērtība',
    'search.filter-field-tooltip-description': 'Lauka apraksts',
    'search.filter-field-tooltip-name': 'Lauka nosaukums',
    'search.filter-field-tooltip-used-in-document-types': 'Izmantots dokumentu tipos',
    'search.filter-no-matches-found': 'Nav atbilstību: {{filter}}',
    'search.filter-number-max-value-placeholder': 'Maks. vērtība',
    'search.filter-number-min-value-placeholder': 'Min. vērtība',
    'search.filter-number-value-placeholder': 'Vērtība',
    'search.filter-placeholder': 'Filtrs',
    'search.filter-reference-clear': 'Notīrīt',
    'search.filter-shared-fields-header': 'Kopīgie lauki',
    'search.filter-string-value-placeholder': 'Vērtība',
    'search.filter-string-value-select-predefined-value': 'Izvēlēties…',
    'search.filters-aria-label_one': 'Filtrs',
    'search.filters-aria-label_other': 'Filtri',
    'search.instructions': 'Izmanto <ControlsIcon/> lai precizētu meklēšanu',
    'search.no-results-help-description': 'Pamēģini citu atslēgvārdu vai pielāgo filtrus',
    'search.no-results-title': 'Rezultāti nav atrasti',
  },
})

const structureBundle = defineLocaleResourceBundle({
  locale: 'lv-LV',
  namespace: 'structure',
  resources: {
    'action.copy-document-id.label': 'Kopēt dokumenta ID',
    'action.copy-document-url.label': 'Kopēt',
    'action.copy-link-to-document.label': 'Kopēt dokumenta URL',
    'action.delete.disabled.not-ready': 'Darbība nav gatava',
    'action.delete.disabled.nothing-to-delete': 'Dokuments vēl neeksistē vai jau ir dzēsts',
    'action.delete.disabled.scheduled-release':
      'Šo dokumentu nevar dzēst, jo tas ir ieplānotā laidienā',
    'action.delete.label': 'Dzēst',
    'action.delete.running.label': 'Dzēš…',
    'action.disabled-by-canvas.tooltip':
      'Dažas dokumenta darbības ir atspējotas dokumentiem, kas sasaistīti ar Canvas',
    'action.discard-changes.confirm-dialog.confirm-discard-changes':
      'Vai tiešām vēlies atmest visas izmaiņas kopš pēdējās publicēšanas?',
    'action.discard-changes.confirm-dialog.confirm-discard-changes-draft':
      'Vai tiešām vēlies atmest visas izmaiņas un dzēst šo melnrakstu?',
    'action.discard-changes.confirm-dialog.header.text': 'Atmest izmaiņas?',
    'action.discard-changes.disabled.no-change': 'Nav nepublicētu izmaiņu',
    'action.discard-changes.disabled.not-published': 'Dokuments nav publicēts',
    'action.discard-changes.disabled.not-ready': 'Darbība nav gatava',
    'action.discard-changes.label': 'Atmest izmaiņas',
    'action.duplicate.disabled.not-ready': 'Darbība nav gatava',
    'action.duplicate.disabled.nothing-to-duplicate':
      'Dokuments vēl neeksistē, tāpēc nav ko dublēt',
    'action.duplicate.label': 'Dublēt',
    'action.duplicate.running.label': 'Dublē…',
    'action.publish.already-published.no-time-ago.tooltip': 'Jau publicēts',
    'action.publish.already-published.tooltip': 'Publicēts {{timeSincePublished}}',
    'action.publish.disabled.not-ready': 'Darbība nav gatava',
    'action.publish.draft.label': 'Publicēt',
    'action.publish.label': 'Publicēt',
    'action.publish.live-edit.label': 'Publicēt',
    'action.publish.live-edit.publish-disabled':
      'Nevar publicēt, jo šim dokumenta tipam ir ieslēgts Live Edit',
    'action.publish.live-edit.tooltip':
      'Šim satura tipam ir ieslēgts Live Edit, un publicēšana notiek automātiski',
    'action.publish.no-changes.tooltip': 'Nav nepublicētu izmaiņu',
    'action.publish.published.label': 'Publicēts',
    'action.publish.running.label': 'Publicē…',
    'action.publish.validation-in-progress.label': 'Pārbauda dokumentu…',
    'action.publish.validation-issues-toast.description':
      'Pirms publicēšanas izlabo validācijas kļūdas',
    'action.publish.validation-issues-toast.title': 'Validācijas kļūdas',
    'action.publish.validation-issues.tooltip':
      'Pirms publicēšanas jāizlabo validācijas kļūdas',
    'action.publish.waiting': 'Gaida, kamēr pabeigsies uzdevumi pirms publicēšanas',
    'action.restore.confirm.message': 'Vai tiešām vēlies atjaunot šo dokumentu?',
    'action.restore.disabled.cannot-restore-initial': 'Nevar atjaunot sākotnējo versiju',
    'action.restore.label': 'Atjaunot versiju',
    'action.restore.tooltip': 'Atjaunot uz šo versiju',
    'action.unpublish.disabled.not-published': 'Dokuments nav publicēts',
    'action.unpublish.disabled.not-ready': 'Darbība nav gatava',
    'action.unpublish.label': 'Atpublicēt',
    'action.unpublish.live-edit.disabled':
      'Šim dokumentam ir ieslēgts Live Edit, un to nevar atpublicēt',
    'menu-items.layout.compact-view': 'Kompaktais skats',
    'menu-items.layout.detailed-view': 'Detalizētais skats',
    'menu-items.sort-by.created': 'Izveidots',
    'menu-items.sort-by.last-edited': 'Pēdējoreiz rediģēts',
  },
})

const copyPasteBundle = defineLocaleResourceBundle({
  locale: 'lv-LV',
  namespace: 'copy-paste',
  resources: {
    'copy-paste.field-action-copy-button.document.title': 'Kopēt dokumentu',
    'copy-paste.field-action-copy-button.field.title': 'Kopēt lauku',
    'copy-paste.field-action-paste-button.document.title': 'Ielīmēt dokumentu',
    'copy-paste.field-action-paste-button.field.title': 'Ielīmēt lauku',
    'copy-paste.on-paste.validation.read-only-target.description': 'Mērķis ir tikai lasāms',
    'copy-paste.on-paste.validation.read-only-fields-skipped.description':
      'Izlaisti tikai-lasāmi lauki: {{fieldNames}}',
    'copy-paste.on-paste.validation.read-only-fields-skipped-truncated.description':
      'Izlaisti tikai-lasāmi lauki: {{fieldNames}} un vēl {{count}}',
    'copy-paste.on-paste.validation.schema-type-incompatible.description':
      'Avota un mērķa shēmas tipi nav savietojami',
    'copy-paste.on-paste.validation.reference-type-incompatible.description':
      'Atsauces tips "{{sourceReferenceType}}" nav atļauts laukā, kas pieņem "{{targetReferenceTypes}}"',
    'copy-paste.on-paste.validation.reference-filter-incompatible.description':
      'Atsauce nav atļauta atbilstoši filtra noteikumiem',
    'copy-paste.on-paste.validation.reference-validation-failed.description':
      'Atsauces dokuments "{{ref}}" neeksistē',
    'copy-paste.on-paste.validation.image-file-incompatible.description':
      '"{{sourceSchemaType}}" nav atļauts laukā "{{targetSchemaType}}"',
    'copy-paste.on-paste.validation.array-type-incompatible.description':
      'Tips "{{type}}" nav atļauts šajā masīva laukā',
    'copy-paste.on-paste.validation.array-value-incompatible.description':
      'Tips "{{type}}" nav atļauts šajā masīva laukā',
    'copy-paste.on-paste.validation.string-value-incompatible.description':
      'Vērtība "{{value}}" nav atļauta. Atļautās: "{{allowedStrings}}"',
    'copy-paste.on-paste.validation.primitive-type-incompatible.description':
      'Tips "{{type}}" nav atļauts šajā laukā',
    'copy-paste.on-paste.validation.clipboard-empty.title': 'Nav ko ielīmēt',
    'copy-paste.on-paste.validation.clipboard-invalid.title': 'Nederīgs starpliktuves ieraksts',
    'copy-paste.on-paste.validation.schema-type-incompatible.title':
      'Neizdevās noteikt shēmas tipu ceļam: {{path}}',
    'copy-paste.on-paste.validation.partial-warning.title':
      'Ne visas vērtības varēja ielīmēt',
    'copy-paste.on-paste.validation.mime-type-incompatible.description':
      'MIME tips "{{mimeType}}" šim laukam nav atļauts',
    'copy-paste.on-paste.validation.mime-type-validation-failed.description':
      'MIME tipa pārbaude neizdevās',
    'copy-paste.on-copy.validation.schema-type-incompatible.title':
      'Neizdevās noteikt shēmas tipu ceļam: {{path}}',
    'copy-paste.on-copy.validation.no-value.title': 'Tukša vērtība, nav ko kopēt',
    'copy-paste.on-copy.validation.clipboard-not-supported.description':
      'Nepieciešama piekļuve starpliktuvei. Atļauj to pārlūka iestatījumos un mēģini vēlreiz.',
    'copy-paste.on-copy.validation.clipboard-not-supported.title':
      'Piekļuve starpliktuvei ir bloķēta',
  },
})

const feedbackBundle = defineLocaleResourceBundle({
  locale: 'lv-LV',
  namespace: 'feedback',
  resources: {
    'feedback.attachment.browse': 'Pārlūkot',
    'feedback.attachment.drop-zone': 'Ievelc vai ielīmē failu šeit',
    'feedback.attachment.error.size': 'Attēlam jābūt mazākam par 20 MB',
    'feedback.attachment.label': 'Pievienot attēlu',
    'feedback.attachment.remove': 'Noņemt',
    'feedback.cancel': 'Atcelt',
    'feedback.consent.disclaimer':
      'Mēs labprāt uzzinātu vairāk. Izvēloties "jā", tavs vārds un e-pasts tiks kopīgoti ar Sanity komandu.',
    'feedback.consent.label': 'Vai drīkstam ar tevi sazināties par šo atsauksmi?',
    'feedback.consent.no': 'Nē',
    'feedback.consent.yes': 'Jā',
    'feedback.dialog.title': 'Nosūti atsauksmi Sanity',
    'feedback.error': 'Neizdevās nosūtīt atsauksmi',
    'feedback.menu-item': 'Nosūtīt atsauksmi',
    'feedback.message.label': 'Kas darbojas labi? Ko var uzlabot?',
    'feedback.message.placeholder': 'Apraksti savu jautājumu vai ierosinājumu...',
    'feedback.sentiment.happy': 'Viegli',
    'feedback.sentiment.label': 'Cik viegli vai grūti ir lietot Sanity?',
    'feedback.sentiment.neutral': 'Nezinu',
    'feedback.sentiment.unhappy': 'Grūti',
    'feedback.submit': 'Nosūtīt atsauksmi',
    'feedback.success': 'Atsauksme nosūtīta, paldies!',
  },
})

const validationBundle = defineLocaleResourceBundle({
  locale: 'lv-LV',
  namespace: 'validation',
  resources: {
    'array.exact-length': 'Jābūt tieši {{wantedLength}} elementiem',
    'array.exact-length_blocks': 'Jābūt tieši {{wantedLength}} blokiem',
    'array.item-duplicate': 'Šī vērtība masīvā ir dublēta',
    'array.maximum-length': 'Drīkst būt ne vairāk kā {{maxLength}} elementi',
    'array.maximum-length_blocks': 'Drīkst būt ne vairāk kā {{maxLength}} bloki',
    'array.minimum-length': 'Jābūt vismaz {{minLength}} elementiem',
    'array.minimum-length_blocks': 'Jābūt vismaz {{minLength}} blokiem',
    'date.invalid-format': 'Nederīgs datuma formāts',
    'date.maximum': 'Datumam jābūt līdz {{maxDate}}',
    'date.minimum': 'Datumam jābūt no {{minDate}}',
    'generic.incorrect-type': 'Nederīgs tips. Sagaidīts {{expectedType}}',
    'generic.not-allowed': 'Vērtība nav atļauta',
    'generic.not-allowed_hint': 'Atļautās vērtības: {{allowedValues}}',
    'generic.required': 'Šis lauks ir obligāts',
    'number.greater-than': 'Jābūt lielākam par {{limit}}',
    'number.less-than': 'Jābūt mazākam par {{limit}}',
    'number.maximum': 'Jābūt ne lielākam par {{limit}}',
    'number.maximum-precision': 'Maksimālā precizitāte: {{maxPrecision}}',
    'number.minimum': 'Jābūt ne mazākam par {{limit}}',
    'number.non-integer': 'Jābūt veselam skaitlim',
    'object.asset-required': 'Fails ir obligāts',
    'object.asset-required_file': 'Fails ir obligāts',
    'object.asset-required_image': 'Attēls ir obligāts',
    'object.media-not-found': 'Fails netika atrasts Media Library',
    'object.not-media-library-asset': 'Jābūt atsaucei uz Media Library failu',
    'object.not-reference': 'Jābūt atsaucei uz dokumentu',
    'object.reference-not-published': 'Atsauces dokumentam jābūt publicētam',
    'panel.close-button-aria-label': 'Aizvērt validāciju',
    'panel.no-errors-message': 'Nav validācijas kļūdu',
    'panel.title': 'Validācija',
    'panel.unpublish-message':
      'Dokuments tiks atpublicēts, validācijas kļūdas netiek rādītas',
    'slug.missing-current': 'Slug laukam jābūt aizpildītam',
    'slug.not-object': 'Slug jābūt objektam',
    'slug.not-unique': 'Šis slug jau tiek izmantots',
    'string.email': 'Jābūt derīgai e-pasta adresei',
    'string.exact-length': 'Jābūt tieši {{wantedLength}} rakstzīmēm',
    'string.lowercase': 'Jābūt tikai mazajiem burtiem',
    'string.maximum-length': 'Drīkst būt ne vairāk kā {{maxLength}} rakstzīmes',
    'string.minimum-length': 'Jābūt vismaz {{minLength}} rakstzīmēm',
    'string.regex-does-not-match': 'Neatbilst "{{name}}" paraugam',
    'string.regex-match': 'Nedrīkst atbilst "{{name}}" paraugam',
    'string.uppercase': 'Jābūt tikai lielajiem burtiem',
    'string.url.disallowed-scheme': 'URL protokols nav atļauts',
    'string.url.includes-credentials': 'Lietotājvārds/parole URL nav atļauti',
    'string.url.invalid': 'Nederīgs URL',
    'string.url.not-absolute': 'Relatīvie URL nav atļauti',
    'string.url.not-relative': 'Atļauti tikai relatīvie URL',
  },
})

const visionBundle = defineLocaleResourceBundle({
  locale: 'lv-LV',
  namespace: 'vision',
  resources: {
    'action.copy-url-to-clipboard': 'Kopēt starpliktuvē',
    'action.delete': 'Dzēst',
    'action.edit-title': 'Rediģēt nosaukumu',
    'action.listen-cancel': 'Apturēt',
    'action.listen-execute': 'Sekot',
    'action.load-queries': 'Ielādēt vaicājumus',
    'action.load-query': 'Ielādēt vaicājumu',
    'action.query-cancel': 'Atcelt',
    'action.query-execute': 'Izpildīt',
    'action.save-query': 'Saglabāt vaicājumu',
    'action.update': 'Atjaunināt',
    'label.actions': 'Darbības',
    'label.edited': 'Rediģēts',
    'label.new': 'Jauns',
    'label.personal': 'Personīgs',
    'label.saved-at': 'Saglabāts',
    'label.saved-queries': 'Saglabātie vaicājumi',
    'label.search-queries': 'Meklēt vaicājumus',
    'label.share': 'Kopīgot',
    'label.team': 'Komanda',
    'params.error.params-invalid-json': 'Parametri nav derīgs JSON',
    'params.label': 'Parametri',
    'query.error.column': 'Kolonna',
    'query.error.line': 'Rinda',
    'query.label': 'Vaicājums',
    'query.url': 'Vaicājuma URL',
    'result.end-to-end-time-label': 'Pilnais laiks',
    'result.execution-time-label': 'Izpildes laiks',
    'result.label': 'Rezultāts',
    'result.save-result-as-csv.not-csv-encodable': 'Rezultātu nevar saglabāt CSV formātā',
    'result.save-result-as-format': 'Saglabāt rezultātu kā <SaveResultButtons/>',
    'result.timing-not-applicable': 'nav pieejams',
    'save-query.already-saved': 'Vaicājums jau ir saglabāts',
    'save-query.error': 'Kļūda, saglabājot vaicājumu',
    'save-query.success': 'Vaicājums saglabāts',
    'settings.api-version-label': 'API versija',
    'settings.custom-api-version-label': 'Pielāgota API versija',
    'settings.dataset-label': 'Datu kopa',
    'settings.error.invalid-api-version': 'Nederīga API versija',
    'settings.other-api-version-label': 'Cita',
    'settings.perspective-label': 'Perspektīva',
    'settings.perspectives.action.docs-link': 'Skatīt dokumentāciju',
    'settings.perspectives.default': 'Bez perspektīvas (API noklusējums)',
    'settings.perspectives.pinned-release-label': 'Piesprausts laidiens',
    'settings.perspectives.scheduled-drafts': 'Ieplānotie melnraksti',
    'settings.perspectives.title': 'Perspektīvas',
  },
})

export const lvLVBundles = [
  studioBundle,
  structureBundle,
  copyPasteBundle,
  feedbackBundle,
  validationBundle,
  visionBundle,
]
