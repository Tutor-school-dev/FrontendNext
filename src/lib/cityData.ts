/**
 * City Data for Location-Based Landing Pages
 * Contains cities, their states, and top areas for SEO-optimized tutor pages
 */

export interface Area {
  name: string;
  slug: string;
}

export interface City {
  name: string;
  slug: string;
  state: string;
  areas: Area[];
}

export interface CityData {
  [key: string]: City;
}

// Top 8 areas for each city based on population density and tutor demand
export const CITY_DATA: CityData = {
  bengaluru: {
    name: "Bengaluru",
    slug: "bengaluru",
    state: "Karnataka",
    areas: [
      { name: "Koramangala", slug: "koramangala" },
      { name: "Indiranagar", slug: "indiranagar" },
      { name: "Whitefield", slug: "whitefield" },
      { name: "Jayanagar", slug: "jayanagar" },
      { name: "BTM Layout", slug: "btm-layout" },
      { name: "Electronic City", slug: "electronic-city" },
      { name: "Marathahalli", slug: "marathahalli" },
      { name: "HSR Layout", slug: "hsr-layout" },
      { name: "Banashankari", slug: "banashankari" },
      { name: "Rajajinagar", slug: "rajajinagar" },
      { name: "Malleswaram", slug: "malleswaram" },
      { name: "Yelahanka", slug: "yelahanka" },
    ],
  },
  mysore: {
    name: "Mysore",
    slug: "mysore",
    state: "Karnataka",
    areas: [
      { name: "Saraswathipuram", slug: "saraswathipuram" },
      { name: "Kuvempunagar", slug: "kuvempunagar" },
      { name: "Vijayanagar", slug: "vijayanagar-mysore" },
      { name: "Hebbal", slug: "hebbal-mysore" },
      { name: "Gokulam", slug: "gokulam" },
      { name: "Jayalakshmipuram", slug: "jayalakshmipuram" },
    ],
  },
  "new-delhi": {
    name: "New Delhi",
    slug: "new-delhi",
    state: "Delhi",
    areas: [
      { name: "Dwarka", slug: "dwarka" },
      { name: "Rohini", slug: "rohini" },
      { name: "Lajpat Nagar", slug: "lajpat-nagar" },
      { name: "Saket", slug: "saket" },
      { name: "Vasant Kunj", slug: "vasant-kunj" },
      { name: "Pitampura", slug: "pitampura" },
      { name: "Janakpuri", slug: "janakpuri" },
      { name: "Greater Kailash", slug: "greater-kailash" },
      { name: "Karol Bagh", slug: "karol-bagh" },
      { name: "Connaught Place", slug: "connaught-place" },
      { name: "Nehru Place", slug: "nehru-place" },
      { name: "Mayur Vihar", slug: "mayur-vihar" },
    ],
  },
  gurgaon: {
    name: "Gurgaon",
    slug: "gurgaon",
    state: "Haryana",
    areas: [
      { name: "Sector 14", slug: "sector-14" },
      { name: "Sector 29", slug: "sector-29" },
      { name: "DLF Phase 1", slug: "dlf-phase-1" },
      { name: "DLF Phase 2", slug: "dlf-phase-2" },
      { name: "Cyber City", slug: "cyber-city" },
      { name: "Golf Course Road", slug: "golf-course-road" },
      { name: "Sohna Road", slug: "sohna-road" },
      { name: "MG Road", slug: "mg-road-gurgaon" },
    ],
  },
  faridabad: {
    name: "Faridabad",
    slug: "faridabad",
    state: "Haryana",
    areas: [
      { name: "Sector 15", slug: "sector-15-faridabad" },
      { name: "Sector 21", slug: "sector-21-faridabad" },
      { name: "Old Faridabad", slug: "old-faridabad" },
      { name: "NIT", slug: "nit-faridabad" },
      { name: "Neelam Chowk", slug: "neelam-chowk" },
      { name: "Ballabhgarh", slug: "ballabhgarh" },
    ],
  },
  mumbai: {
    name: "Mumbai",
    slug: "mumbai",
    state: "Maharashtra",
    areas: [
      { name: "Andheri", slug: "andheri" },
      { name: "Bandra", slug: "bandra" },
      { name: "Powai", slug: "powai" },
      { name: "Thane", slug: "thane" },
      { name: "Borivali", slug: "borivali" },
      { name: "Malad", slug: "malad" },
      { name: "Kandivali", slug: "kandivali" },
      { name: "Juhu", slug: "juhu" },
    ],
  },
  hyderabad: {
    name: "Hyderabad",
    slug: "hyderabad",
    state: "Telangana",
    areas: [
      { name: "Gachibowli", slug: "gachibowli" },
      { name: "Madhapur", slug: "madhapur" },
      { name: "Kukatpally", slug: "kukatpally" },
      { name: "Secunderabad", slug: "secunderabad" },
      { name: "Begumpet", slug: "begumpet" },
      { name: "Kondapur", slug: "kondapur" },
      { name: "Miyapur", slug: "miyapur" },
      { name: "Jubilee Hills", slug: "jubilee-hills" },
    ],
  },
  pune: {
    name: "Pune",
    slug: "pune",
    state: "Maharashtra",
    areas: [
      { name: "Baner", slug: "baner" },
      { name: "Wakad", slug: "wakad" },
      { name: "Kothrud", slug: "kothrud" },
      { name: "Aundh", slug: "aundh" },
      { name: "Hadapsar", slug: "hadapsar" },
      { name: "Viman Nagar", slug: "viman-nagar" },
      { name: "Shivaji Nagar", slug: "shivaji-nagar" },
      { name: "Hinjewadi", slug: "hinjewadi" },
      { name: "Deccan", slug: "deccan" },
      { name: "Camp", slug: "camp" },
      { name: "Koregaon Park", slug: "koregaon-park" },
      { name: "Magarpatta", slug: "magarpatta" },
    ],
  },
  nashik: {
    name: "Nashik",
    slug: "nashik",
    state: "Maharashtra",
    areas: [
      { name: "Gangapur Road", slug: "gangapur-road" },
      { name: "College Road", slug: "college-road" },
      { name: "Cidco", slug: "cidco-nashik" },
      { name: "Canada Corner", slug: "canada-corner" },
      { name: "Panchavati", slug: "panchavati" },
      { name: "Govind Nagar", slug: "govind-nagar" },
    ],
  },
  nagpur: {
    name: "Nagpur",
    slug: "nagpur",
    state: "Maharashtra",
    areas: [
      { name: "Sitabuldi", slug: "sitabuldi" },
      { name: "Dharampeth", slug: "dharampeth" },
      { name: "Sadar", slug: "sadar-nagpur" },
      { name: "Hingna", slug: "hingna" },
      { name: "Wardhaman Nagar", slug: "wardhaman-nagar" },
      { name: "Bajaj Nagar", slug: "bajaj-nagar" },
    ],
  },
  chennai: {
    name: "Chennai",
    slug: "chennai",
    state: "Tamil Nadu",
    areas: [
      { name: "Anna Nagar", slug: "anna-nagar" },
      { name: "T. Nagar", slug: "t-nagar" },
      { name: "Velachery", slug: "velachery" },
      { name: "Adyar", slug: "adyar" },
      { name: "Tambaram", slug: "tambaram" },
      { name: "Chrompet", slug: "chrompet" },
      { name: "OMR", slug: "omr" },
      { name: "Porur", slug: "porur" },
      { name: "Nungambakkam", slug: "nungambakkam" },
      { name: "Mylapore", slug: "mylapore" },
      { name: "Sholinganallur", slug: "sholinganallur" },
      { name: "Guindy", slug: "guindy" },
    ],
  },
  coimbatore: {
    name: "Coimbatore",
    slug: "coimbatore",
    state: "Tamil Nadu",
    areas: [
      { name: "RS Puram", slug: "rs-puram" },
      { name: "Gandhipuram", slug: "gandhipuram" },
      { name: "Peelamedu", slug: "peelamedu" },
      { name: "Saravanampatti", slug: "saravanampatti" },
      { name: "Race Course", slug: "race-course" },
      { name: "Vadavalli", slug: "vadavalli" },
      { name: "Singanallur", slug: "singanallur" },
      { name: "Kuniyamuthur", slug: "kuniyamuthur" },
    ],
  },
  jaipur: {
    name: "Jaipur",
    slug: "jaipur",
    state: "Rajasthan",
    areas: [
      { name: "Malviya Nagar", slug: "malviya-nagar" },
      { name: "C-Scheme", slug: "c-scheme" },
      { name: "Vaishali Nagar", slug: "vaishali-nagar" },
      { name: "Mansarovar", slug: "mansarovar" },
      { name: "Tonk Road", slug: "tonk-road" },
      { name: "Ajmer Road", slug: "ajmer-road" },
      { name: "Jagatpura", slug: "jagatpura" },
      { name: "Sodala", slug: "sodala" },
    ],
  },
  lucknow: {
    name: "Lucknow",
    slug: "lucknow",
    state: "Uttar Pradesh",
    areas: [
      { name: "Gomti Nagar", slug: "gomti-nagar" },
      { name: "Indira Nagar", slug: "indira-nagar" },
      { name: "Aliganj", slug: "aliganj" },
      { name: "Mahanagar", slug: "mahanagar" },
      { name: "Rajajipuram", slug: "rajajipuram" },
      { name: "Hazratganj", slug: "hazratganj" },
      { name: "Chowk", slug: "chowk" },
      { name: "Alambagh", slug: "alambagh" },
    ],
  },
  indore: {
    name: "Indore",
    slug: "indore",
    state: "Madhya Pradesh",
    areas: [
      { name: "Vijay Nagar", slug: "vijay-nagar" },
      { name: "Rajendra Nagar", slug: "rajendra-nagar" },
      { name: "Sapna Sangeeta", slug: "sapna-sangeeta" },
      { name: "Palasia", slug: "palasia" },
      { name: "Bhawarkuan", slug: "bhawarkuan" },
      { name: "New Palasia", slug: "new-palasia" },
      { name: "Geeta Bhawan", slug: "geeta-bhawan" },
      { name: "Rau", slug: "rau" },
    ],
  },
  ahmedabad: {
    name: "Ahmedabad",
    slug: "ahmedabad",
    state: "Gujarat",
    areas: [
      { name: "Satellite", slug: "satellite" },
      { name: "Navrangpura", slug: "navrangpura" },
      { name: "CG Road", slug: "cg-road" },
      { name: "Vastrapur", slug: "vastrapur" },
      { name: "Maninagar", slug: "maninagar" },
      { name: "Bopal", slug: "bopal" },
      { name: "Ambawadi", slug: "ambawadi" },
      { name: "Prahlad Nagar", slug: "prahlad-nagar" },
    ],
  },
  surat: {
    name: "Surat",
    slug: "surat",
    state: "Gujarat",
    areas: [
      { name: "Adajan", slug: "adajan" },
      { name: "Vesu", slug: "vesu" },
      { name: "Athwa", slug: "athwa" },
      { name: "Nanpura", slug: "nanpura" },
      { name: "Udhna", slug: "udhna" },
      { name: "City Light", slug: "city-light" },
      { name: "Pal", slug: "pal-surat" },
      { name: "Rander", slug: "rander" },
    ],
  },
  kolkata: {
    name: "Kolkata",
    slug: "kolkata",
    state: "West Bengal",
    areas: [
      { name: "Salt Lake", slug: "salt-lake" },
      { name: "Park Street", slug: "park-street" },
      { name: "Ballygunge", slug: "ballygunge" },
      { name: "Howrah", slug: "howrah" },
      { name: "Jadavpur", slug: "jadavpur" },
      { name: "New Town", slug: "new-town" },
      { name: "Gariahat", slug: "gariahat" },
      { name: "Behala", slug: "behala" },
    ],
  },
};

// Helper functions
export function getCityBySlug(slug: string): City | null {
  return CITY_DATA[slug] || null;
}

export function getAllCities(): City[] {
  return Object.values(CITY_DATA);
}

export function getCityNames(): string[] {
  return Object.values(CITY_DATA).map(city => city.name);
}

export function getCitySlugs(): string[] {
  return Object.keys(CITY_DATA);
}

export function isValidCitySlug(slug: string): boolean {
  return slug in CITY_DATA;
}

// SEO URL generation
export function generateCityURL(citySlug: string): string {
  return `/${citySlug}`;
}

// Meta data generation for SEO
export function generateCityMetadata(city: City) {
  return {
    title: `Find the Best Tutors in ${city.name} for Your Child | TutorSchool`,
    description: `Get verified tutors across ${city.areas.slice(0, 3).map(a => a.name).join(', ')} and all major areas of ${city.name}. Area-wise, subject-wise and budget-wise matching in under 24 hours.`,
    keywords: [
      `tutors in ${city.name.toLowerCase()}`,
      `home tutors in ${city.name.toLowerCase()}`,
      `${city.name.toLowerCase()} tutors`,
      `tuition teachers in ${city.name.toLowerCase()}`,
      `private tutors ${city.name.toLowerCase()}`,
    ],
  };
}