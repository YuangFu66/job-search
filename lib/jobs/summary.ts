const sentencePattern = /[^.!?]+[.!?]+/g;

type SummaryOptions = {
  minSentences?: number;
  maxSentences?: number;
};

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string) {
  const normalized = collapseWhitespace(text);
  const matches = normalized.match(sentencePattern);

  if (matches?.length) {
    return matches.map((sentence) => sentence.trim());
  }

  return normalized
    .split(/(?:\s+-\s+|\.\s+|;\s+)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => `${sentence.replace(/[.!?]+$/, "")}.`);
}

function pickSentence(sentences: string[], keywords: string[]) {
  const loweredKeywords = keywords.map((keyword) => keyword.toLowerCase());
  return sentences.find((sentence) =>
    loweredKeywords.some((keyword) => sentence.toLowerCase().includes(keyword))
  );
}

export function createJobSummary(
  description: string,
  payRange?: string | null,
  options: SummaryOptions = {}
) {
  const minSentences = options.minSentences ?? 3;
  const maxSentences = options.maxSentences ?? 3;
  const sentences = splitSentences(description);
  if (sentences.length === 0) {
    return payRange
      ? `Responsibilities were not provided. Qualifications were not provided. Pay range: ${payRange}.`
      : "Responsibilities were not provided. Qualifications were not provided. Compensation details were not provided.";
  }

  const responsibilities =
    pickSentence(sentences, [
      "build",
      "deliver",
      "lead",
      "design",
      "develop",
      "own",
      "ship",
      "partner"
    ]) ?? sentences[0];
  const qualifications =
    pickSentence(sentences, [
      "experience",
      "background",
      "skill",
      "qualifications",
      "proficient",
      "years"
    ]) ?? sentences[1] ?? sentences[0];
  const workDetailsSource =
    pickSentence(sentences, [
      "remote",
      "hybrid",
      "salary",
      "compensation",
      "benefits",
      "onsite",
      "on-site"
    ]) ?? sentences[2] ?? sentences[1] ?? sentences[0];

  const summaryParts = [responsibilities, qualifications, workDetailsSource]
    .filter(Boolean)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence, index, array) => array.findIndex((item) => item === sentence) === index);

  while (summaryParts.length < minSentences) {
    summaryParts.push(
      summaryParts.length === 0
        ? "Responsibilities were not provided."
        : summaryParts.length === 1
          ? "Qualifications were not provided."
          : payRange
            ? `Compensation details include ${payRange}.`
            : "Compensation details were not provided."
    );
  }

  if (payRange && !summaryParts[2]?.toLowerCase().includes(payRange.toLowerCase())) {
    summaryParts[2] = `${summaryParts[2]?.replace(/[.!?]+$/, "") ?? "Compensation details are available"}; pay range ${payRange}.`;
  }

  return summaryParts.slice(0, maxSentences).join(" ");
}
