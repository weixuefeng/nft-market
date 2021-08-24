import 'i18n'
import { useTranslation } from 'react-i18next'

export default function Me() {
  const { t } = useTranslation()
  return <main>{t('create')}</main>
}
