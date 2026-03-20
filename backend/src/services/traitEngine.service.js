/**
 * Trait Engine Service — Prajnaa DNA Health Analyzer
 * Evaluates parsed SNP data against trait rules to produce health predisposition insights.
 * Pure functions — no side effects, fully testable.
 */

const { TRAIT_RULES, STATUS } = require('../data/traitRules');

/**
 * @typedef {Object} TraitResult
 * @property {string} traitKey
 * @property {string} title
 * @property {string} category
 * @property {string} icon
 * @property {string} status
 * @property {string} summary
 * @property {Array<{rsid: string, genotype: string, found: boolean}>} matchedSnps
 * @property {string} confidence
 * @property {string} evidenceNote
 * @property {string} limitationNote
 * @property {string} disclaimer
 * @property {string} recommendation
 */

/**
 * Evaluates a single trait against the provided SNP map.
 * @param {import('../data/traitRules').TraitRule} rule
 * @param {Record<string, import('./genomeParser.service').ParsedSnp>} snpMap
 * @returns {TraitResult}
 */
function evaluateTrait(rule, snpMap) {
  const matchedSnps = [];
  let bestMatch = null;

  for (const requiredRsid of rule.requiredSnps) {
    const snpData = snpMap[requiredRsid.toLowerCase()];

    if (!snpData) {
      matchedSnps.push({ rsid: requiredRsid, genotype: null, found: false });
      continue;
    }

    matchedSnps.push({
      rsid: requiredRsid,
      genotype: snpData.genotype,
      found: true,
    });

    // Skip no-call genotypes
    if (snpData.genotype === '-' || snpData.genotype === '--') {
      continue;
    }

    // Find matching genotype rule
    const genotypeRule = rule.genotypeRules.find(
      (gr) => gr.snp === requiredRsid && gr.genotype === snpData.genotype
    );

    if (genotypeRule) {
      // Prefer higher-confidence matches, or predisposition_detected over typical
      if (
        !bestMatch ||
        genotypeRule.status === STATUS.PREDISPOSITION_DETECTED ||
        genotypeRule.status === STATUS.LIMITED_EVIDENCE
      ) {
        bestMatch = genotypeRule;
      }
    }
  }

  // Determine if we found any required SNPs
  const foundCount = matchedSnps.filter((s) => s.found).length;
  const hasAnyData = foundCount > 0;

  if (!hasAnyData) {
    return {
      traitKey: rule.key,
      title: rule.title,
      category: rule.category,
      icon: rule.icon,
      description: rule.description,
      status: STATUS.NOT_FOUND,
      summary: `No relevant marker detected in supported SNP set. None of the required markers (${rule.requiredSnps.join(', ')}) were found in your data.`,
      matchedSnps,
      confidence: 'none',
      evidenceNote: rule.evidenceNote,
      limitationNote: rule.limitationNote,
      disclaimer: rule.disclaimer,
      recommendation: rule.recommendation,
    };
  }

  if (!bestMatch) {
    return {
      traitKey: rule.key,
      title: rule.title,
      category: rule.category,
      icon: rule.icon,
      description: rule.description,
      status: STATUS.INSUFFICIENT_DATA,
      summary: `Insufficient data for this trait. The required SNP markers were found but the genotype combination is not in our current evaluation rules.`,
      matchedSnps,
      confidence: 'low',
      evidenceNote: rule.evidenceNote,
      limitationNote: rule.limitationNote,
      disclaimer: rule.disclaimer,
      recommendation: rule.recommendation,
    };
  }

  return {
    traitKey: rule.key,
    title: rule.title,
    category: rule.category,
    icon: rule.icon,
    description: rule.description,
    status: bestMatch.status,
    summary: bestMatch.summary,
    matchedSnps,
    confidence: bestMatch.confidence,
    evidenceNote: rule.evidenceNote,
    limitationNote: rule.limitationNote,
    disclaimer: rule.disclaimer,
    recommendation: rule.recommendation,
  };
}

/**
 * Runs all trait evaluations against a SNP map.
 * @param {Record<string, import('./genomeParser.service').ParsedSnp>} snpMap
 * @returns {TraitResult[]}
 */
function evaluateAllTraits(snpMap) {
  return Object.values(TRAIT_RULES).map((rule) => evaluateTrait(rule, snpMap));
}

module.exports = { evaluateTrait, evaluateAllTraits };
