import {useDocumentOperation, type DocumentActionComponent} from 'sanity'

const howToBuyImagePaths = ['heroImage', 'financingImage.image', 'documentsImage.image']
const siteSettingsImagePaths = ['logo']

export const clearPendingUploadsAction: DocumentActionComponent = (props) => {
  if (!['howToBuyPage', 'siteSettings'].includes(props.type)) {
    return null
  }

  const {patch} = useDocumentOperation(props.id, props.type)

  const imagePaths = props.type === 'howToBuyPage' ? howToBuyImagePaths : siteSettingsImagePaths
  const unsetPaths = imagePaths.flatMap((path) => [path, `${path}._upload`])

  return {
    label: 'Notīrīt iestrēgušās augšupielādes',
    title: 'Piespiedu kārtā notīra iestrēgušas attēlu augšupielādes šī dokumenta melnrakstā.',
    onHandle: () => {
      patch.execute([{unset: unsetPaths}])
      props.onComplete()
    },
  }
}
