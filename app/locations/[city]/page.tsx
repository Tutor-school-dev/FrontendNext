import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug, generateCityMetadata, isValidCitySlug } from '@/lib/cityData';
import CityLandingPage from '@/components/city/CityLandingPage';

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

// Generate static params for all our hot cities for better SEO
export async function generateStaticParams() {
  const cities = [
    'bengaluru',
    'new-delhi', 
    'mumbai',
    'hyderabad',
    'pune',
    'chennai',
    'jaipur',
    'lucknow',
    'indore',
    'kolkata'
  ];

  return cities.map((city) => ({
    city: city,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const cityData = getCityBySlug(resolvedParams.city);
  
  if (!cityData) {
    return {
      title: 'City Not Found | TutorSchool',
      description: 'The requested city page was not found.',
    };
  }

  const metadata = generateCityMetadata(cityData);
  
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/tutorschool-icon.png',
          width: 1200,
          height: 630,
          alt: `TutorSchool - Find tutors in ${cityData.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: `/locations/${resolvedParams.city}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  
  // Validate city slug
  if (!isValidCitySlug(resolvedParams.city)) {
    notFound();
  }

  const cityData = getCityBySlug(resolvedParams.city);
  
  if (!cityData) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <CityLandingPage city={cityData} />
    </main>
  );
}