import {aboutPageType} from './schemaTypes/documents/aboutPage'
import {contactPageType} from './schemaTypes/documents/contactPage'
import {homepageType} from './schemaTypes/documents/homepage'
import {howToBuyPageType} from './schemaTypes/documents/howToBuyPage'
import {pageType} from './schemaTypes/documents/page'
import {projectDocument} from './schemaTypes/documents/project'
import {propertyTypeDocument} from './schemaTypes/documents/propertyType'
import {propertyDocument} from './schemaTypes/documents/property'
import {siteSettingsType} from './schemaTypes/documents/siteSettings'
import {ctaType} from './schemaTypes/objects/cta'
import {detailItemType} from './schemaTypes/objects/detailItem'
import {featureItemType} from './schemaTypes/objects/featureItem'
import {galleryImageType} from './schemaTypes/objects/galleryImage'
import {howToBuyFaqItemType} from './schemaTypes/objects/howToBuyFaqItem'
import {howToBuyStepType} from './schemaTypes/objects/howToBuyStep'
import {metricItemType} from './schemaTypes/objects/metricItem'
import {seoType} from './schemaTypes/objects/seo'
import {socialLinkType} from './schemaTypes/objects/socialLink'

export const schemaTypes = [
  seoType,
  ctaType,
  metricItemType,
  featureItemType,
  galleryImageType,
  detailItemType,
  howToBuyStepType,
  howToBuyFaqItemType,
  socialLinkType,
  propertyTypeDocument,
  projectDocument,
  propertyDocument,
  aboutPageType,
  contactPageType,
  homepageType,
  howToBuyPageType,
  siteSettingsType,
  pageType,
]
