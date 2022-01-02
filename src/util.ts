const quantifierLookup = {
  half: 0.5,
  once: 1,
  each: 1,
  every: 1,
  twice: 1 / 2,
  thrice: 1 / 3,
};

const directOrdinalLookup = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  thirtieth: 30,
  fourthieth: 40,
  fifthieth: 50,
  sixtieth: 60,
  seventieth: 70,
  eightieth: 80,
  ninetieth: 90,
  hundreth: 100,
};

const directCardinalLookup = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  fourty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
};

const millisecond = 1;
const second = 1000;
const minute = 60000;
const hour = 3600000;
const day = 86400000;
const week = 604800000;
const month = 2628000000;
const quarter = 3 * month;
const year = 31536000000;

export const periodLookup = {
  millisecond: millisecond,
  milliseconds: millisecond,
  second: second,
  seconds: second,
  minute: minute,
  minutes: minute,
  hour: hour,
  hours: hour,
  day: day,
  days: day,
  week: week,
  weeks: week,
  month: month,
  months: month,
  quarter: quarter,
  quarters: quarter,
  year: year,
  years: year,

  // Weekday aliases.
  monday: week,
  tuesday: week,
  wednesday: week,
  thursday: week,
  friday: week,
  saturday: week,
  sunday: week,

  // Month aliases
  january: year,
  february: year,
  march: year,
  april: year,
  may: year,
  june: year,
  july: year,
  august: year,
  september: year,
  october: year,
  november: year,
  december: year,

  // Quarter aliases
  q1: year,
  q2: year,
  q3: year,
  q4: year,
};

const temporalPrepositions = new Set([
  "after",
  "afterwards",
  "at",
  "before",
  "by",
  "during",
  "from",
  "in",
  "into",
  "on",
  "of",
  "since",
  "through",
  "to",
  "until",
  "within",
]);

interface ParseDurationLikeStringConfig {
  outputUnit:
    | "milliseconds"
    | "seconds"
    | "minutes"
    | "hours"
    | "days"
    | "weeks"
    | "months"
    | "years";
}

function convertToFinalUnit(
  duration: number,
  outputUnit: ParseDurationLikeStringConfig["outputUnit"]
): number {
  switch (outputUnit) {
    case "milliseconds":
      return duration;
    case "seconds":
      return duration / second;
    case "minutes":
      return duration / minute;
    case "hours":
      return duration / hour;
    case "days":
      return duration / day;
    case "weeks":
      return duration / week;
    case "months":
      return duration / month;
    case "years":
      return duration / year;
  }
}

const numberRegex = /^[0-9]+$|^[0-9]+\.[0-9]+$/;

export function parseDurationLikeString(
  durationLikeString: string,
  config?: ParseDurationLikeStringConfig
): number | null {
  if (durationLikeString === "") {
    return null;
  }

  const overloadedConfig = config ?? { outputUnit: "milliseconds" };

  const tokenized = durationLikeString.split(" ");

  // If we have a single token, we try to parse it as a simple duration indicator,
  // like 1s, 1m etc.
  if (tokenized.length === 1) {
    const parsed =
      parseShortDurationLikeStringToMilliseconds(durationLikeString);
    if (parsed === null) {
      return parsed;
    }

    return convertToFinalUnit(parsed, overloadedConfig.outputUnit);
  }

  let frequencyIndicated = null;
  let periodIndicated = null;

  // This is true if the sentence is of the form "twice a month", "two times a month",
  // instead of, say, "every two months".
  let inverseFrequencyIndicated = false;

  for (let i = 0; i < tokenized.length; i++) {
    const token = tokenized[i].toLowerCase();

    if (token === "times" || token === "time") {
      inverseFrequencyIndicated = true;
    }

    // This is typical for phrases like "every day at 12" or "every week on Monday".
    //
    // If we find a temporal preposition and we already have indicators, we bail out
    // as there may be indicators after the temporal preposition that we should ignore.
    if (
      temporalPrepositions.has(token) &&
      frequencyIndicated &&
      periodIndicated
    ) {
      break;
    }

    // Handle the "second"-case especially, as it is both an ordinal and a period.
    if (token === "second") {

      // If the period is after a temporal preposition, we ignore it.
      const nextTemporalPrepositionIndex = tokenized.findIndex((t) =>
        temporalPrepositions.has(t)
      );

      const hasAFollowingPeriodIndicator = tokenized
        .slice(
          i + 1,
          nextTemporalPrepositionIndex === -1
            ? undefined
            : nextTemporalPrepositionIndex
        )
        .some((x) => x in periodLookup);

      if (!hasAFollowingPeriodIndicator) {
        periodIndicated = 1000;
      } else {
        frequencyIndicated = directOrdinalLookup["second"];
      }
    } else if (numberRegex.test(token)) {
      const number = parseInt(token, 10);

      frequencyIndicated = number;
    } else if (token in quantifierLookup) {
      frequencyIndicated =
        quantifierLookup[token as keyof typeof quantifierLookup];
    } else if (token in directCardinalLookup) {
      frequencyIndicated =
        directCardinalLookup[token as keyof typeof directCardinalLookup];
    } else if (token in directOrdinalLookup) {
      frequencyIndicated =
        directOrdinalLookup[token as keyof typeof directOrdinalLookup];
    } else if (token in periodLookup) {
      periodIndicated = periodLookup[token as keyof typeof periodLookup];
    }
  }

  if (frequencyIndicated === null || periodIndicated === null) {
    return null;
  }

  if (inverseFrequencyIndicated) {
    frequencyIndicated = 1 / frequencyIndicated;
  }

  return convertToFinalUnit(
    frequencyIndicated * periodIndicated,
    overloadedConfig.outputUnit
  );
}

const durationLikeStringRegex = /^(\d+)([a-zA-Z]+)$/;

const shortDurationPeriodLookups = {
  ms: millisecond,
  s: second,
  m: minute,
  h: hour,
  d: day,
  w: week,
  M: month,
  y: year,
};

export function parseShortDurationLikeStringToMilliseconds(
  durationLikeString: string
): number | null {
  const match = durationLikeString.match(durationLikeStringRegex);

  if (match === null) {
    return null;
  }

  const [, duration, unit] = match;

  return (
    parseInt(duration) *
    shortDurationPeriodLookups[unit as keyof typeof shortDurationPeriodLookups]
  );
}
