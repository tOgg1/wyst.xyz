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

export const periodLookup = {
  millisecond: 1,
  milliseconds: 1,
  second: 1000,
  seconds: 1000,
  minute: 60000,
  minutes: 60000,
  hour: 3600000,
  hours: 3600000,
  day: 86400000,
  days: 86400000,
  week: 604800000,
  weeks: 604800000,
  month: 2628000000,
  months: 2628000000,
  quarter: 7884000000,
  quarters: 7884000000,
  year: 31536000000,
  years: 31536000000,
};

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
      return duration / 1000;
    case "minutes":
      return duration / 60000;
    case "hours":
      return duration / 3600000;
    case "days":
      return duration / 86400000;
    case "weeks":
      return duration / 604800000;
    case "months":
      return duration / 2628000000;
    case "years":
      return duration / 31536000000;
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

  if (tokenized.length === 1) {
    const parsed =
      parseShortDurationLikeStringToMilliseconds(durationLikeString);
    if (parsed === null) {
      return parsed;
    }

    return convertToFinalUnit(parsed, overloadedConfig.outputUnit);
  }

  // Iterate through the tokens and see if we can find a quantifier, a
  // cardinal, or an ordinal.

  let frequencyIndicated = null; // Default is "each" or "every"
  let periodIndicated = null; // Default is "second"

  let inverseFrequencyIndicated = false;

  for (let i = 0; i < tokenized.length; i++) {
    const token = tokenized[i];

    if (token === "times") {
      inverseFrequencyIndicated = true;
    }

    if (numberRegex.test(token)) {
      const number = parseInt(token, 10);

      // Find the period indicated
      const period = tokenized
        .slice(i + 1)
        .find((t) => periodLookup[t as keyof typeof periodLookup]);

      if (period === undefined) {
        continue;
      }

      frequencyIndicated = number;
      periodIndicated = periodLookup[period as keyof typeof periodLookup];
    } else if (token in quantifierLookup) {
      frequencyIndicated =
        quantifierLookup[token as keyof typeof quantifierLookup];
    } else if (token in directCardinalLookup) {
      frequencyIndicated =
        directCardinalLookup[token as keyof typeof directCardinalLookup];
    } else if (token in directOrdinalLookup) {
      // Handle the "second" ordinal specially, as it may be both an ordinal
      // but also a period indicator
      const hasAFollowingPeriodIndicator = tokenized
        .slice(i + 1)
        .some((x) => x in periodLookup);

      if (!hasAFollowingPeriodIndicator) {
        // Handle as a period
        periodIndicated = 1000;
      } else {
        frequencyIndicated =
          directOrdinalLookup[token as keyof typeof directOrdinalLookup];
      }
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
  ms: 1,
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
  w: 604800000,
  M: 2628000000,
  y: 31536000000,
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
