const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Glissa - аренда яхт в Ялте',
  description:
    'Аренда яхт в Ялте 2026. Моторные и парусные яхты, катамараны от 8 000 руб/час. Опытные капитаны, безопасные прогулки по Крыму.',
  url: 'https://glissa.ru',
  telephone: '+79790840089',
  priceRange: 'от 8 000 ₽/час',
  image: 'https://glissa.ru/yachts/palassa/01-exterior.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Набережная им. Ленина, 1',
    addressLocality: 'Ялта',
    addressRegion: 'Республика Крым',
    postalCode: '298600',
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.4963,
    longitude: 34.1639,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '22:00',
      validFrom: '2026-05-01',
      validThrough: '2026-10-31',
    },
  ],
  sameAs: ['https://t.me/glissa_yacht_yalta'],
  hasMap: 'https://maps.yandex.ru/?text=Ялта%20причал%20яхты',
  currenciesAccepted: 'RUB',
  paymentAccepted: 'Cash, Credit Card',
};

export default function SchemaOrg() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
