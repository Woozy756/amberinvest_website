import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {deskStructure} from './src/sanity/deskStructure'
import {schemaTypes} from './src/sanity/schemaTypes'
import {clearPendingUploadsAction} from './src/sanity/documentActions/clearPendingUploads'
import {lvLVBundles, lvLVLocale} from './src/sanity/i18n/lvLV'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'kshtq64w'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'amberinvest',
  title: 'Amberinvest',
  projectId,
  dataset,
  plugins: [structureTool({structure: deskStructure})],
  i18n: {
    // Last locale in this array becomes the default active locale in Studio.
    locales: (prev) => [...prev, lvLVLocale],
    bundles: (prev) => [...prev, ...lvLVBundles],
  },
  document: {
    actions: (prev, context) =>
      context.schemaType === 'howToBuyPage' || context.schemaType === 'siteSettings'
        ? [...prev, clearPendingUploadsAction]
        : prev,
  },
  schema: {
    types: schemaTypes,
  },
})
