import type { Yacht } from '@/lib/data';

interface Props {
  yacht: Yacht;
  id: string;
}

export default function YachtSchemaOrg({ yacht, id }: Props) {
  const base = 'https://glissa.ru';
  const url = `${base}/yacht/${id}`;
  const image = `${base}${yacht.photos[0]}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `Аренда яхты ${yacht.name} в Ялте`,
        description: yacht.description,
        image: yacht.photos.map(p => `${base}${p}`),
        brand: { '@type': 'Brand', name: 'Glissa' },
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'RUB',
          price: yacht.pricePerHour,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: yacht.pricePerHour,
            priceCurrency: 'RUB',
            unitText: 'ЧАС',
            unitCode: 'HUR',
          },
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'Glissa', url: base },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            doesNotShip: true,
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'RU',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 1,
            returnFees: 'https://schema.org/FreeReturn',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '47',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: base },
          { '@type': 'ListItem', position: 2, name: 'Каталог яхт', item: `${base}/catalog` },
          { '@type': 'ListItem', position: 3, name: yacht.name, item: url },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
