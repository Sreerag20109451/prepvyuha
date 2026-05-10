import type { SyllabusModel, SyllabusSubject } from "@/types/prep";
import { subjectsFromSyllabusModel } from "@/lib/syllabus-model";

const now = 0;

export const CURRENT_EVENTS_SECTION = {
  id: "current-events",
  label: "Current Events",
  areas: [
    "National importance",
    "International importance",
    "Government schemes and policies",
    "Reports, indices and institutions in news",
    "Science, environment, economy and security developments in news",
  ],
};

export const FULL_UPSC_SYLLABUS_MODEL: SyllabusModel = {
  id: "upsc-cse-complete",
  title: "Complete UPSC CSE Syllabus",
  exam: "UPSC CSE",
  cycle: "2027",
  version: 4,
  sources: [
    "IAS Parliament UPSC Decoding Syllabus PDF",
    "Vajiram & Ravi UPSC syllabus",
    "Vajiram & Ravi NCERT books for UPSC",
  ],
  paperCount: 7,
  subjectCount: 18,
  topicCount: 86,
  subtopicCount: 86,
  createdAt: now,
  updatedAt: now,
  papers: [
    {
      id: "prelims-gs1",
      syllabusId: "upsc-cse-complete",
      label: "Prelims GS Paper I",
      stage: "prelims",
      kind: "gs",
      description: "Objective General Studies paper. Current events are shown separately and are not progress-tracked.",
      order: 0,
      subjects: [
        subject("prelims-gs1", "history", "History", 0, [
          specific("ancient-history", "Ancient History", 0, [
            area("prehistoric-vedic", "Prehistoric to Vedic", 0, [
              "Stone age and chalcolithic cultures",
              "Indus Valley Civilization",
              "Vedic age and later Vedic society",
            ]),
            area("religion-empires", "Religions and Empires", 1, [
              "Mahajanapadas, Buddhism and Jainism",
              "Mauryan empire and Ashokan dhamma",
              "Post-Mauryan, Gupta and post-Gupta age",
              "Sangam age",
            ]),
          ]),
          specific("medieval-history", "Medieval History", 1, [
            area("medieval-polity-culture", "Polity and Culture", 0, [
              "Delhi Sultanate",
              "Vijayanagara and Bahmani kingdoms",
              "Mughals, Marathas and regional powers",
              "Bhakti and Sufi movements",
            ]),
          ]),
          specific("modern-history", "Modern History and National Movement", 2, [
            area("colonial-expansion", "Colonial Expansion", 0, [
              "Advent of Europeans",
              "Expansion of British power",
              "Economic impact of British rule",
            ]),
            area("national-movement", "National Movement", 1, [
              "Revolt of 1857",
              "Socio-religious reform movements",
              "INC, moderates, extremists and revolutionaries",
              "Gandhian movements from Champaran to Quit India",
              "Constitutional developments, INA, independence and partition",
            ]),
          ]),
          specific("art-culture", "Art and Culture", 3, [
            area("culture-forms", "Cultural Forms", 0, [
              "Architecture, sculpture and paintings",
              "Music, dance, theatre and puppetry",
              "Literature, language and philosophy",
              "UNESCO heritage and cultural institutions",
            ]),
          ]),
        ]),
        subject("prelims-gs1", "geography", "Geography", 1, [
          specific("physical-geography", "Physical Geography", 0, [
            area("earth-systems", "Earth Systems", 0, [
              "Solar system, latitude, longitude and time",
              "Interior of earth, rocks, earthquakes and volcanoes",
              "Landforms and geomorphic processes",
            ]),
            area("climate-ocean", "Climate and Oceanography", 1, [
              "Atmosphere, pressure, winds and rainfall",
              "Climate systems and climatic regions",
              "Oceans, currents, tides and marine resources",
            ]),
          ]),
          specific("indian-geography", "Indian Geography", 1, [
            area("india-physical-economic", "Physical and Economic India", 0, [
              "Physiographic divisions and drainage",
              "Indian monsoon, soils and vegetation",
              "Agriculture, minerals, industries and transport",
              "Population, settlement and urbanization",
              "Map locations in news",
            ]),
          ]),
        ]),
        subject("prelims-gs1", "polity", "Polity and Governance", 2, [
          specific("constitution", "Constitution", 0, [
            area("constitutional-framework", "Constitutional Framework", 0, [
              "Historical background, making and salient features",
              "Preamble, citizenship and amendments",
              "Fundamental Rights, DPSP and Fundamental Duties",
              "Basic structure and judicial review",
            ]),
          ]),
          specific("institutions", "Political Institutions", 1, [
            area("union-state-local", "Union, State and Local Government", 0, [
              "President, Governor, PM, CM and councils of ministers",
              "Parliament and state legislatures",
              "Supreme Court, High Courts and tribunals",
              "Federalism and centre-state relations",
              "Local self-government",
            ]),
            area("bodies-governance", "Bodies and Governance", 1, [
              "Constitutional, statutory and regulatory bodies",
              "Transparency, accountability and citizen charters",
              "Public policy and rights issues",
            ]),
          ]),
        ]),
        subject("prelims-gs1", "economics", "Economics", 3, [
          specific("indian-economy", "Indian Economy", 0, [
            area("macro-fiscal-monetary", "Macro, Fiscal and Monetary", 0, [
              "National income, growth and development",
              "Planning, budgeting, taxation and public finance",
              "Money, banking, inflation, RBI and monetary policy",
              "External sector, BoP, trade and exchange rate",
            ]),
            area("sectors-inclusion", "Sectors and Inclusion", 1, [
              "Agriculture, MSP, PDS and food security",
              "Poverty, inclusion and social sector initiatives",
              "Infrastructure, industry, investment and employment",
            ]),
          ]),
        ]),
        subject("prelims-gs1", "environment", "Environment", 4, [
          specific("ecology-environment", "Ecology and Environment", 0, [
            area("ecology-biodiversity", "Ecology and Biodiversity", 0, [
              "Ecosystems, food chains and biogeochemical cycles",
              "Biodiversity, protected areas, species and conservation",
              "Pollution, waste management and EIA",
              "Climate change, conventions and carbon markets",
              "Environmental institutions and laws",
            ]),
          ]),
        ]),
        subject("prelims-gs1", "science-tech", "Science and Technology", 5, [
          specific("general-science", "General Science", 0, [
            area("science-basics", "Science Basics", 0, [
              "Physics, chemistry and biology fundamentals",
              "Health, diseases, nutrition, biotechnology and vaccines",
            ]),
          ]),
          specific("technology", "Technology in News", 1, [
            area("emerging-tech", "Emerging Technology", 0, [
              "Space technology and satellites",
              "IT, AI, robotics, cyber and communication",
              "Nanotechnology, nuclear technology and IPR",
            ]),
          ]),
        ]),
      ],
    },
    {
      id: "prelims-csat",
      syllabusId: "upsc-cse-complete",
      label: "Prelims GS Paper II - CSAT",
      stage: "prelims",
      kind: "csat",
      description: "Qualifying aptitude paper.",
      order: 1,
      subjects: [
        subject("prelims-csat", "aptitude", "Aptitude", 0, [
          specific("csat-comprehension", "Comprehension", 0, [
            area("csat-reading", "Reading", 0, ["Reading comprehension passages"]),
          ]),
          specific("csat-reasoning", "Reasoning", 1, [
            area("csat-logic", "Logic", 0, [
              "Logical reasoning and analytical ability",
              "Decision making and problem solving",
              "General mental ability",
            ]),
          ]),
          specific("csat-numeracy", "Numeracy", 2, [
            area("csat-data", "Numeracy and Data", 0, [
              "Basic numeracy",
              "Data interpretation from charts, graphs and tables",
            ]),
          ]),
        ]),
      ],
    },
    mainsPaper("mains-gs1", "Mains GS Paper I", 2, [
      subject("mains-gs1", "history", "History", 0, [
        specific("mains-culture", "Indian Heritage and Culture", 0, [
          area("mains-culture-forms", "Art and Culture", 0, [
            "Art forms, literature and architecture from ancient to modern times",
          ]),
        ]),
        specific("mains-modern-history", "Modern Indian History", 1, [
          area("mains-modern-events", "Modern India", 0, [
            "Significant events, personalities and issues from mid-18th century",
            "Freedom struggle stages and contributors",
            "Post-independence consolidation and reorganization",
          ]),
        ]),
        specific("mains-world-history", "World History", 2, [
          area("mains-world-events", "World since 18th Century", 0, [
            "Industrial revolution, world wars and redrawal of boundaries",
            "Colonization, decolonization and political philosophies",
          ]),
        ]),
      ]),
      subject("mains-gs1", "society", "Indian Society", 1, [
        specific("mains-society", "Society", 0, [
          area("mains-social-issues", "Social Issues", 0, [
            "Salient features and diversity of India",
            "Women, population, poverty, development and urbanization",
            "Globalization effects on Indian society",
            "Social empowerment, communalism, regionalism and secularism",
          ]),
        ]),
      ]),
      subject("mains-gs1", "geography", "Geography", 2, [
        specific("mains-geography", "World and Indian Geography", 0, [
          area("mains-geo-core", "Physical, Economic and Geophysical", 0, [
            "World physical geography",
            "Resources and location of industries",
            "Earthquakes, tsunami, volcanoes, cyclones and location changes",
          ]),
        ]),
      ]),
    ]),
    mainsPaper("mains-gs2", "Mains GS Paper II", 3, [
      subject("mains-gs2", "polity", "Polity", 0, [
        specific("mains-constitution-polity", "Constitution and Political System", 0, [
          area("mains-polity-core", "Constitutional Governance", 0, [
            "Indian Constitution, evolution, features and basic structure",
            "Federalism and devolution",
            "Separation of powers and dispute redressal",
            "Parliament, state legislatures, executive and judiciary",
            "RPA, constitutional posts and statutory bodies",
          ]),
        ]),
      ]),
      subject("mains-gs2", "governance", "Governance", 1, [
        specific("mains-governance-social-justice", "Governance and Social Justice", 0, [
          area("mains-governance-core", "Governance Delivery", 0, [
            "Government policies and implementation issues",
            "NGOs, SHGs, donors and development processes",
            "Welfare schemes for vulnerable sections",
            "Health, education, poverty and hunger",
            "Transparency, accountability, e-governance and citizen charters",
            "Role of civil services in democracy",
          ]),
        ]),
      ]),
      subject("mains-gs2", "international-relations", "International Relations", 2, [
        specific("mains-ir", "International Relations", 0, [
          area("mains-ir-core", "India and World", 0, [
            "India and neighbourhood",
            "Bilateral, regional and global groupings",
            "Policies of developed and developing countries and diaspora",
            "International institutions, agencies and fora",
          ]),
        ]),
      ]),
    ]),
    mainsPaper("mains-gs3", "Mains GS Paper III", 4, [
      subject("mains-gs3", "economics", "Economics", 0, [
        specific("mains-economy", "Economy and Development", 0, [
          area("mains-economy-core", "Development Economy", 0, [
            "Growth, development, employment and inclusive growth",
            "Budgeting",
            "Agriculture, irrigation, subsidies, MSP, PDS and food security",
            "Food processing, supply chains and land reforms",
            "Liberalization, industry, infrastructure and investment models",
          ]),
        ]),
      ]),
      subject("mains-gs3", "science-tech", "Science and Technology", 1, [
        specific("mains-science-tech", "Science and Technology", 0, [
          area("mains-tech-core", "Technology Applications", 0, [
            "Developments and applications in everyday life",
            "Indian achievements and indigenization",
            "IT, space, computers, robotics, nano-tech, bio-tech and IPR",
          ]),
        ]),
      ]),
      subject("mains-gs3", "environment", "Environment and Disaster", 2, [
        specific("mains-environment-disaster", "Environment and Disaster Management", 0, [
          area("mains-env-disaster-core", "Environment and Disaster", 0, [
            "Conservation, pollution, degradation and EIA",
            "Disaster and disaster management",
          ]),
        ]),
      ]),
      subject("mains-gs3", "security", "Internal Security", 3, [
        specific("mains-security", "Internal Security", 0, [
          area("mains-security-core", "Security Issues", 0, [
            "Extremism and development",
            "External state and non-state actors",
            "Communication networks, media, cyber security and money laundering",
            "Border management and organized crime-terrorism linkages",
            "Security forces and agencies",
          ]),
        ]),
      ]),
    ]),
    mainsPaper("mains-gs4", "Mains GS Paper IV", 5, [
      subject("mains-gs4", "ethics", "Ethics", 0, [
        specific("mains-ethics", "Ethics, Integrity and Aptitude", 0, [
          area("mains-ethics-core", "Ethics Core", 0, [
            "Ethics and human interface",
            "Attitude, thought, behaviour and persuasion",
            "Aptitude and foundational civil service values",
            "Emotional intelligence",
            "Moral thinkers and philosophers",
            "Public service values and probity in governance",
            "Case studies on ethical issues",
          ]),
        ]),
      ]),
    ]),
    mainsPaper("mains-essay", "Mains Essay", 6, [
      subject("mains-essay", "essay", "Essay", 0, [
        specific("essay-writing", "Essay Writing", 0, [
          area("essay-themes", "Themes", 0, [
            "Society, governance, economy, environment and abstract themes",
          ]),
        ]),
      ]),
    ]),
  ],
};

export const FULL_UPSC_SYLLABUS_SUBJECTS: SyllabusSubject[] =
  subjectsFromSyllabusModel(FULL_UPSC_SYLLABUS_MODEL);

export const DEFAULT_SYLLABUS_SUBJECTS = FULL_UPSC_SYLLABUS_SUBJECTS;

function topic(
  paperId: string,
  subjectId: string,
  specificSubjectId: string,
  areaId: string,
  label: string,
  order: number,
) {
  return {
    id: `${areaId}-${slug(label)}`,
    syllabusId: "upsc-cse-complete",
    paperId,
    subjectId,
    specificSubjectId,
    areaId,
    label,
    description: "",
    order,
  };
}

function area(id: string, label: string, order: number, topicLabels: string[]) {
  return { id, label, description: "", order, topicLabels };
}

function specific(
  id: string,
  label: string,
  order: number,
  areas: ReturnType<typeof area>[],
) {
  return {
    id,
    label,
    description: "",
    order,
    areas: areas.map((a) => ({
      ...a,
      topics: [] as ReturnType<typeof topic>[],
    })),
  };
}

function subject(
  paperId: string,
  id: string,
  label: string,
  order: number,
  specifics: ReturnType<typeof specific>[],
) {
  return {
    id,
    syllabusId: "upsc-cse-complete",
    paperId,
    label,
    description: "",
    order,
    specificSubjects: specifics.map((sp) => ({
      ...sp,
      syllabusId: "upsc-cse-complete",
      paperId,
      subjectId: id,
      areas: sp.areas.map((a) => {
        const { topicLabels, ...rest } = a;
        return {
          ...rest,
          syllabusId: "upsc-cse-complete",
          paperId,
          subjectId: id,
          specificSubjectId: sp.id,
          topics: topicLabels.map((label, index) =>
            topic(paperId, id, sp.id, rest.id, label, index),
          ),
        };
      }),
    })),
  };
}

function mainsPaper(
  id: string,
  label: string,
  order: number,
  subjects: ReturnType<typeof subject>[],
) {
  return {
    id,
    syllabusId: "upsc-cse-complete",
    label,
    stage: "mains" as const,
    kind: id === "mains-essay" ? ("essay" as const) : ("gs" as const),
    description: "",
    order,
    subjects,
  };
}

function slug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 56);
}
