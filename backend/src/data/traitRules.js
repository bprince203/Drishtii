/**
 * Trait rules configuration for health-related genetic predispositions.
 * Each trait defines required SNPs, genotype rules, and result mappings.
 *
 * IMPORTANT: These rules are for educational/informational purposes ONLY.
 * They are simplified representations of complex genetic interactions.
 * Informational only. Not medical advice. Not for diagnosis or treatment.
 */

const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
  PLACEHOLDER: 'placeholder',
};

const STATUS = {
  PREDISPOSITION_DETECTED: 'predisposition_detected',
  TYPICAL: 'typical',
  INSUFFICIENT_DATA: 'insufficient_data',
  NOT_FOUND: 'not_found',
  LIMITED_EVIDENCE: 'limited_evidence',
};

const TRAIT_RULES = {
  lactose_intolerance: {
    key: 'lactose_intolerance',
    title: 'Lactase Persistence — Lactose Digestion',
    category: 'Metabolic Health',
    icon: 'milk',
    description:
      'Genetic predisposition related to the ability to produce lactase enzyme into adulthood. The MCM6 gene variant near the LCT gene influences lactase persistence and may affect digestive comfort with dairy.',
    requiredSnps: ['rs4988235', 'rs182549'],
    genotypeRules: [
      {
        snp: 'rs4988235',
        genotype: 'TT',
        status: STATUS.TYPICAL,
        summary: 'No relevant marker detected for reduced lactase production. Your genotype is associated with typical lactase persistence into adulthood.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs4988235',
        genotype: 'CT',
        status: STATUS.TYPICAL,
        summary: 'One copy of the lactase persistence variant detected. Typically associated with adequate lactase production in adulthood.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs4988235',
        genotype: 'TC',
        status: STATUS.TYPICAL,
        summary: 'One copy of the lactase persistence variant detected. Typically associated with adequate lactase production in adulthood.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs4988235',
        genotype: 'CC',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Higher genetic predisposition detected for reduced lactase production in adulthood. This marker is associated with elevated likelihood of lactose malabsorption in some populations.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs182549',
        genotype: 'CC',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Marker associated with reduced lactase persistence detected. This may indicate a higher predisposition toward lactose malabsorption.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
      {
        snp: 'rs182549',
        genotype: 'CT',
        status: STATUS.TYPICAL,
        summary: 'One copy of the lactase persistence variant detected at this marker.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
      {
        snp: 'rs182549',
        genotype: 'TC',
        status: STATUS.TYPICAL,
        summary: 'One copy of the lactase persistence variant detected at this marker.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
      {
        snp: 'rs182549',
        genotype: 'TT',
        status: STATUS.TYPICAL,
        summary: 'No relevant marker detected for reduced lactase production at this position.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
    ],
    evidenceNote:
      'The rs4988235 (LCT -13910 C>T) variant is one of the most well-studied SNPs related to lactase persistence, particularly in European populations. Results may vary across different ancestries.',
    limitationNote:
      'This analysis covers only selected markers and does not account for gut microbiome composition, dietary adaptation, or other environmental factors that influence lactose tolerance.',
    disclaimer:
      'Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. Consult a healthcare provider for dietary guidance.',
    recommendation:
      'If a predisposition is detected, consider discussing with a healthcare provider. A food diary may help identify personal tolerance levels.',
  },

  alcohol_flush: {
    key: 'alcohol_flush',
    title: 'ALDH2 Deficiency — Alcohol Metabolism',
    category: 'Metabolic Health',
    icon: 'wine',
    description:
      'Genetic predisposition related to alcohol metabolism efficiency. Variants in the ALDH2 gene can affect how the body processes acetaldehyde, a byproduct of alcohol metabolism.',
    requiredSnps: ['rs671'],
    genotypeRules: [
      {
        snp: 'rs671',
        genotype: 'GG',
        status: STATUS.TYPICAL,
        summary: 'No relevant marker detected for reduced ALDH2 enzyme activity. Your genotype is associated with typical alcohol metabolism.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs671',
        genotype: 'AG',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Marker associated with reduced ALDH2 enzyme function detected. This is associated with elevated risk for alcohol flush reaction and slower acetaldehyde clearance.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs671',
        genotype: 'GA',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Marker associated with reduced ALDH2 enzyme function detected. This is associated with elevated risk for alcohol flush reaction and slower acetaldehyde clearance.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
      {
        snp: 'rs671',
        genotype: 'AA',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Higher genetic predisposition detected for significantly reduced ALDH2 activity. This genotype is strongly associated with alcohol flush reaction and impaired acetaldehyde metabolism.',
        confidence: CONFIDENCE_LEVELS.HIGH,
      },
    ],
    evidenceNote:
      'The ALDH2*2 variant (rs671) is highly prevalent in East Asian populations and is one of the most well-established pharmacogenomic markers. It affects acetaldehyde metabolism.',
    limitationNote:
      'This analysis does not account for other alcohol metabolism pathways (ADH variants) or environmental factors such as medication interactions or liver health.',
    disclaimer:
      'Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. Consult a healthcare provider about alcohol and your health.',
    recommendation:
      'If a predisposition is detected, discuss with a healthcare provider. Reduced ALDH2 function may indicate slower breakdown of acetaldehyde.',
  },

  caffeine_metabolism: {
    key: 'caffeine_metabolism',
    title: 'CYP1A2 Activity — Caffeine Metabolism',
    category: 'Metabolic Health',
    icon: 'coffee',
    description:
      'Genetic predisposition related to the speed of caffeine metabolism. The CYP1A2 gene encodes the primary enzyme responsible for caffeine breakdown in the liver.',
    requiredSnps: ['rs762551'],
    genotypeRules: [
      {
        snp: 'rs762551',
        genotype: 'AA',
        status: STATUS.TYPICAL,
        summary: 'No relevant marker detected for slow caffeine metabolism. Your genotype suggests rapid CYP1A2 enzyme inducibility (fast metabolizer).',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
      {
        snp: 'rs762551',
        genotype: 'AC',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Marker associated with intermediate caffeine metabolism detected. Caffeine effects may persist longer compared to fast metabolizers.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
      {
        snp: 'rs762551',
        genotype: 'CA',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Marker associated with intermediate caffeine metabolism detected. Caffeine effects may persist longer compared to fast metabolizers.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
      {
        snp: 'rs762551',
        genotype: 'CC',
        status: STATUS.PREDISPOSITION_DETECTED,
        summary: 'Higher genetic predisposition detected for slow caffeine metabolism. CYP1A2 enzyme activity may be lower, causing caffeine to remain active longer in the body.',
        confidence: CONFIDENCE_LEVELS.MODERATE,
      },
    ],
    evidenceNote:
      'CYP1A2 (rs762551) is a well-studied SNP. The A allele is associated with higher CYP1A2 inducibility (fast metabolism). Environmental factors like smoking also influence caffeine metabolism.',
    limitationNote:
      'Caffeine sensitivity is influenced by multiple genes, tolerance buildup, body weight, medications, and other factors not captured in this single-SNP analysis.',
    disclaimer:
      'Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. Speak to a healthcare provider if concerned about caffeine sensitivity.',
    recommendation:
      'If slow metabolism is indicated, consider discussing caffeine intake patterns with a healthcare provider, especially regarding sleep and cardiovascular health.',
  },

  gluten_sensitivity: {
    key: 'gluten_sensitivity',
    title: 'HLA-DQ2/DQ8 — Celiac Predisposition',
    category: 'Inherited Predisposition',
    icon: 'wheat',
    description:
      'Genetic predisposition related to celiac disease. HLA-DQ2 and HLA-DQ8 haplotypes are necessary (but NOT sufficient) risk factors for celiac disease development.',
    requiredSnps: ['rs2187668', 'rs7454108'],
    genotypeRules: [
      {
        snp: 'rs2187668',
        genotype: 'TT',
        status: STATUS.LIMITED_EVIDENCE,
        summary: 'Marker associated with the HLA-DQ2.5 haplotype detected. This is a necessary but NOT sufficient condition for celiac disease. Most carriers never develop celiac disease.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs2187668',
        genotype: 'CT',
        status: STATUS.LIMITED_EVIDENCE,
        summary: 'One copy of a variant associated with HLA-DQ2.5 detected. This alone does not indicate celiac disease and most carriers remain unaffected.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs2187668',
        genotype: 'TC',
        status: STATUS.LIMITED_EVIDENCE,
        summary: 'One copy of a variant associated with HLA-DQ2.5 detected. This alone does not indicate celiac disease and most carriers remain unaffected.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs2187668',
        genotype: 'CC',
        status: STATUS.TYPICAL,
        summary: 'No relevant marker detected for HLA-DQ2.5-associated predisposition at this position. This reduces (but does not eliminate) the genetic risk component.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs7454108',
        genotype: 'TT',
        status: STATUS.LIMITED_EVIDENCE,
        summary: 'Marker associated with the HLA-DQ8 haplotype detected. Like HLA-DQ2, it is a necessary but not sufficient risk factor for celiac disease.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs7454108',
        genotype: 'CT',
        status: STATUS.LIMITED_EVIDENCE,
        summary: 'One copy of a variant associated with HLA-DQ8 detected.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs7454108',
        genotype: 'TC',
        status: STATUS.LIMITED_EVIDENCE,
        summary: 'One copy of a variant associated with HLA-DQ8 detected.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
      {
        snp: 'rs7454108',
        genotype: 'CC',
        status: STATUS.TYPICAL,
        summary: 'No relevant marker detected for HLA-DQ8-associated predisposition at this position.',
        confidence: CONFIDENCE_LEVELS.LOW,
      },
    ],
    evidenceNote:
      'Celiac disease genetics are complex. HLA-DQ2 and HLA-DQ8 are necessary but not sufficient — ~30-40% of the general population carries these variants, but only ~1% develop celiac disease. This analysis uses simplified SNP tagging.',
    limitationNote:
      'This analysis cannot determine full HLA haplotype status. A proper celiac workup requires serological testing (tTG-IgA) and often intestinal biopsy. Genetic markers alone are insufficient for diagnosis or exclusion.',
    disclaimer:
      'Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. This is NOT a celiac disease test. A proper diagnosis requires clinical evaluation.',
    recommendation:
      'If you have symptoms or concerns, speak with a gastroenterologist. Do not self-diagnose or make dietary changes based solely on genetic markers.',
  },
};

module.exports = { TRAIT_RULES, CONFIDENCE_LEVELS, STATUS };
