import type { EstablishmentFull } from '@nightr/types'
import OpeningHours from './sections/opening-hours'
import AddressSection from './sections/address-section'
import ContactSection from './sections/contact-section'
import TagsSection from './sections/tags-section'
import DescriptionSection from './sections/description-section'

type Props = {
  establishment: EstablishmentFull
}

export default function OverviewTab({ establishment }: Props) {
  const cityName = establishment.cities?.name

  return (
    <>
      <OpeningHours opening_hours={establishment.opening_hours ?? []} />
      <AddressSection address={establishment.address} cityName={cityName} />
      <ContactSection phone={establishment.phone} website={establishment.website} />
      <TagsSection ambiance={establishment.ambiance} tags={establishment.tags} />
      <DescriptionSection description={establishment.description} />
    </>
  )
}
