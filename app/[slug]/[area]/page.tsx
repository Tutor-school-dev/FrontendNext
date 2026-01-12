import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug, generateCityMetadata, isValidCitySlug } from '@/lib/cityData';
import TutorSearchContentNew from '../../tutor-search/TutorSearchContentNew';

interface TutorAreaPageProps {
  params: Promise<{
    slug: string;
    area: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TutorAreaPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Check if area follows the pattern "tutors-in-{areaslug}"
  if (!resolvedParams.area.startsWith('tutors-in-')) {
    return {
      title: 'Page Not Found | TutorSchool',
      description: 'The requested page was not found.',
    };
  }
  
  // Extract the actual area slug from "tutors-in-{areaslug}"
  const areaSlug = resolvedParams.area.replace('tutors-in-', '');
  
  const cityData = getCityBySlug(resolvedParams.slug);
  
  if (!cityData) {
    return {
      title: 'City Not Found | TutorSchool',
      description: 'The requested city page was not found.',
    };
  }

  // Find area in city data
  const cityName = cityData.name;
  const areaData = areaSlug === 'all' ? null : cityData.areas.find(a => a.slug === areaSlug);
  const areaName = areaData?.name || cityName;

  const title = `Find Home Tutors in ${areaName}, ${cityName} | Best K-10 Tutors | TutorSchool`;
  const description = `Connect with verified home tutors in ${areaName}, ${cityName}. Expert K-10 teachers for all subjects. Personalized learning at your doorstep. Book a free trial today!`;

  return {
    title,
    description,
    keywords: [
      `home tutors in ${areaName}`,
      `tutors in ${cityName}`,
      `private tutors ${areaName}`,
      `home tuition ${cityName}`,
      'K-10 tutors',
      'verified teachers',
      `${areaName} tutors`,
      'personalized learning',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'TutorSchool',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${resolvedParams.slug}/tutors-in-${resolvedParams.area}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    other: {
      'geo.placename': `${areaName}, ${cityName}`,
      'geo.region': 'IN',
    },
  };
}

export default async function TutorAreaPage({ params }: TutorAreaPageProps) {
  const resolvedParams = await params;
  
  console.log('TutorAreaPage params:', { slug: resolvedParams.slug, area: resolvedParams.area });
  
  // Check if area follows the pattern "tutors-in-{areaslug}"
  if (!resolvedParams.area.startsWith('tutors-in-')) {
    console.log('Area does not start with tutors-in-:', resolvedParams.area);
    notFound();
  }
  
  // Extract the actual area slug from "tutors-in-{areaslug}"
  const areaSlug = resolvedParams.area.replace('tutors-in-', '');
  console.log('Extracted area slug:', areaSlug);
  
  // Validate city slug
  if (!isValidCitySlug(resolvedParams.slug)) {
    console.log('Invalid city slug:', resolvedParams.slug);
    notFound();
  }

  const cityData = getCityBySlug(resolvedParams.slug);
  
  if (!cityData) {
    console.log('City data not found for:', resolvedParams.slug);
    notFound();
  }

  // Validate area exists in city (allow "all" as special case)
  if (areaSlug !== 'all') {
    const areaData = cityData.areas.find(a => a.slug === areaSlug);
    if (!areaData) {
      console.log('Area not found:', areaSlug, 'Available areas:', cityData.areas.map(a => a.slug));
      // Don't throw notFound for invalid areas, just show all tutors in city
      // This is more forgiving for user input
    }
  }

  return (
    <main className="min-h-screen">
      <TutorSearchContentNew 
        citySlug={resolvedParams.slug}
        areaSlug={areaSlug}
      />
    </main>
  );
}
