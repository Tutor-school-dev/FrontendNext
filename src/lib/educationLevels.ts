/**
 * Educational Level Constants for TutorSchool Platform
 * Comprehensive classification of educational levels from primary to doctoral
 */

export interface EducationLevel {
  value: string;
  label: string;
  description: string;
  category: string;
}

export const EDUCATION_LEVELS: EducationLevel[] = [
  // I. SCHOOL LEVEL (Pre-Stream)
  {
    value: "Primary_School_Student",
    label: "Primary School (Classes 1-5)",
    description: "Foundation learning for young students",
    category: "School Level"
  },
  {
    value: "Secondary_School_Student", 
    label: "Secondary School (Classes 6-10)",
    description: "Core subjects and board exam preparation",
    category: "School Level"
  },

  // II. SENIOR SECONDARY STREAM (Classes 11-12)
  {
    value: "Senior_Secondary_Stream_Science",
    label: "Senior Secondary - Science (Classes 11-12)", 
    description: "Physics, Chemistry, Biology/Mathematics",
    category: "Senior Secondary"
  },
  {
    value: "Senior_Secondary_Stream_Commerce",
    label: "Senior Secondary - Commerce (Classes 11-12)",
    description: "Accounting, Business Studies, Economics", 
    category: "Senior Secondary"
  },
  {
    value: "Senior_Secondary_Stream_Arts_or_Humanities",
    label: "Senior Secondary - Arts/Humanities (Classes 11-12)",
    description: "History, Political Science, Psychology",
    category: "Senior Secondary"
  },

  // III. UNDERGRADUATE (UG) LEVEL SPECIALIZATIONS
  {
    value: "UG_Science_Engineering_Core_(CSE/ECE/Mech/Civil)",
    label: "UG Engineering Core (CSE/ECE/Mech/Civil)",
    description: "Core engineering disciplines",
    category: "Undergraduate"
  },
  {
    value: "UG_Science_Pure_and_Applied_(Physics/Chem/Maths/Biotech)",
    label: "UG Pure & Applied Sciences",
    description: "Physics, Chemistry, Mathematics, Biotechnology",
    category: "Undergraduate"
  },
  {
    value: "UG_Science_Medical_and_Health_Sciences_(MBBS/BDS)",
    label: "UG Medical & Health Sciences",
    description: "MBBS, BDS, and health-related programs",
    category: "Undergraduate"
  },
  {
    value: "UG_Commerce_Accounting_Taxation_and_Finance",
    label: "UG Commerce - Accounting & Finance",
    description: "B.Com, Accounting, Taxation, Finance",
    category: "Undergraduate"
  },
  {
    value: "UG_Commerce_Business_Administration_and_Management_(BBA/BMS)",
    label: "UG Business Administration (BBA/BMS)",
    description: "Business management and administration",
    category: "Undergraduate"
  },
  {
    value: "UG_Arts_Humanities_and_Social_Sciences_(History/Psychology/Sociology)",
    label: "UG Arts & Social Sciences",
    description: "History, Psychology, Sociology, Literature",
    category: "Undergraduate"
  },
  {
    value: "UG_Arts_Law_Integrated_(BA_LLB)",
    label: "UG Integrated Law (BA LLB)",
    description: "5-year integrated law programs",
    category: "Undergraduate"
  },

  // IV. POSTGRADUATE (PG) LEVEL SPECIALIZATIONS
  {
    value: "PG_Technology_Advanced_Engineering_(AI/VLSI/Robotics)",
    label: "PG Advanced Engineering (AI/VLSI/Robotics)",
    description: "M.Tech in emerging technologies",
    category: "Postgraduate"
  },
  {
    value: "PG_Science_Advanced_Pure_Sciences_and_Research",
    label: "PG Advanced Sciences & Research",
    description: "M.Sc, research-oriented programs",
    category: "Postgraduate"
  },
  {
    value: "PG_Management_MBA_Functional_(Finance/Marketing/HR)",
    label: "MBA Functional (Finance/Marketing/HR)",
    description: "Core MBA specializations",
    category: "Postgraduate"
  },
  {
    value: "PG_Management_MBA_Sectoral_Analytics_and_Supply_Chain",
    label: "MBA Sectoral Analytics & Supply Chain",
    description: "Specialized MBA in analytics and operations",
    category: "Postgraduate"
  },
  {
    value: "PG_Arts_Advanced_Policy_and_Specialized_Humanities",
    label: "PG Advanced Policy & Humanities",
    description: "M.A in policy studies and humanities",
    category: "Postgraduate"
  },
  {
    value: "PG_Law_LLM_Specialization_(Cyber_Law/IPR/Corporate)",
    label: "LLM Specialization (Cyber/IPR/Corporate)",
    description: "Advanced legal studies",
    category: "Postgraduate"
  },

  // V. DOCTORAL (PhD) LEVEL RESEARCH AREAS
  {
    value: "Doctoral_Scholar_STEM_Frontier_Technology_and_Basic_Science_Research",
    label: "PhD STEM & Technology Research",
    description: "Doctoral research in science and technology",
    category: "Doctoral"
  },
  {
    value: "Doctoral_Scholar_Management_Organizational_Behavior_and_Strategy_Research",
    label: "PhD Management & Strategy Research", 
    description: "Doctoral research in management studies",
    category: "Doctoral"
  },
  {
    value: "Doctoral_Scholar_Arts_Law_Theoretical_and_Policy_Research",
    label: "PhD Arts, Law & Policy Research",
    description: "Doctoral research in humanities and law",
    category: "Doctoral"
  }
];

// Helper functions
export function getEducationLevelsByCategory(category: string): EducationLevel[] {
  return EDUCATION_LEVELS.filter(level => level.category === category);
}

export function getEducationLevelByValue(value: string): EducationLevel | undefined {
  return EDUCATION_LEVELS.find(level => level.value === value);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(EDUCATION_LEVELS.map(level => level.category)));
}

// Simplified options for dropdowns
export function getSimplifiedOptions(): { value: string; label: string }[] {
  return EDUCATION_LEVELS.map(level => ({
    value: level.value,
    label: level.label
  }));
}

// Legacy class mapping for backward compatibility
export const LEGACY_CLASS_MAPPING = {
  "1-4": "Primary_School_Student",
  "5-8": "Secondary_School_Student", 
  "9-10": "Secondary_School_Student",
  "11-12": "Senior_Secondary_Stream_Science" // Default to Science for 11-12
};