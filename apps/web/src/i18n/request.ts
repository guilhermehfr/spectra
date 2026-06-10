import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import en from '../../messages/en.json'
import ptBR from '../../messages/pt-BR.json'

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale = store.get('locale')?.value || 'en'

  return {
    locale,
    messages: locale === 'pt-BR' ? ptBR : en,
  }
})
