import { parseDurationLikeString } from "./util";

const oneSecond = 1000;
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;
const oneWeek = 604800000;
const oneMonth = 2628000000;
const oneYear = 31536000000;

describe("parseDurationLikeString", () => {
  it("should handle simple every directives", () => {
    expect(parseDurationLikeString("every month")).toBe(oneMonth);
    expect(parseDurationLikeString("every week")).toBe(oneWeek);
    expect(parseDurationLikeString("every day")).toBe(oneDay);
    expect(parseDurationLikeString("every hour")).toBe(oneHour);
    expect(parseDurationLikeString("every minute")).toBe(oneMinute);
    expect(parseDurationLikeString("every second")).toBe(oneSecond);
    expect(
      parseDurationLikeString("every millisecond", {
        outputUnit: "milliseconds",
      })
    ).toBe(1);
  });

  it("should handle more complex every directives including arbitrary duration indicators", () => {
    expect(parseDurationLikeString("every quarter")).toBe(3 * oneMonth);
    expect(parseDurationLikeString("every half hour")).toBe(30 * oneMinute);
    expect(parseDurationLikeString("every 90 minutes")).toBe(
      90 * oneMinute
    );
    expect(parseDurationLikeString("every wednesday")).toBe(oneWeek);
    expect(parseDurationLikeString("every january")).toBe(oneYear);
    expect(parseDurationLikeString("every second month")).toBe(2 * oneMonth);
    expect(parseDurationLikeString("every second week")).toBe(2 * oneWeek);

    expect(parseDurationLikeString("every third second")).toBe(3 * oneSecond);
  });

  it("should properly ignore temporal prepositions", () => {
    expect(parseDurationLikeString("every second of the day")).toBe(oneSecond)
    expect(parseDurationLikeString("every second of the month")).toBe(oneSecond)
    expect(parseDurationLikeString("every third second of the month")).toBe(3 * oneSecond)

    expect(parseDurationLikeString("every day at 12")).toBe(oneDay);
    expect(parseDurationLikeString("every Monday")).toBe(oneWeek);
    expect(parseDurationLikeString("the first day every month")).toBe(oneMonth);
    expect(parseDurationLikeString("every quarter of the year")).toBe(3 * oneMonth);

    expect(parseDurationLikeString("every second of the day at 12")).toBe(oneSecond)
    expect(parseDurationLikeString("every January")).toBe(oneYear);
  })

  it("should handle once, twice and thrice directives", () => {
    expect(parseDurationLikeString("once a month")).toBeCloseTo(oneMonth);
    expect(parseDurationLikeString("twice a month")).toBeCloseTo(oneMonth / 2);
    expect(parseDurationLikeString("thrice a month")).toBeCloseTo(oneMonth / 3);

    expect(parseDurationLikeString("once a week")).toBeCloseTo(oneWeek);
    expect(parseDurationLikeString("twice a week")).toBeCloseTo(oneWeek / 2);
    expect(parseDurationLikeString("thrice a week")).toBeCloseTo(oneWeek / 3);

    expect(parseDurationLikeString("once a day")).toBeCloseTo(oneDay);
    expect(parseDurationLikeString("twice a day")).toBeCloseTo(oneDay / 2);
    expect(parseDurationLikeString("thrice a day")).toBeCloseTo(oneDay / 3);

    expect(parseDurationLikeString("once an hour")).toBeCloseTo(oneHour);
    expect(parseDurationLikeString("twice an hour")).toBeCloseTo(oneHour / 2);
    expect(parseDurationLikeString("thrice an hour")).toBeCloseTo(oneHour / 3);

    expect(parseDurationLikeString("once a minute")).toBeCloseTo(oneMinute);
    expect(parseDurationLikeString("twice a minute")).toBeCloseTo(oneMinute / 2);
    expect(parseDurationLikeString("thrice a minute")).toBeCloseTo(oneMinute / 3);

    expect(parseDurationLikeString("once a second")).toBeCloseTo(oneSecond);
    expect(parseDurationLikeString("twice a second")).toBeCloseTo(oneSecond / 2);
    expect(parseDurationLikeString("thrice a second")).toBeCloseTo(oneSecond / 3);
  });

  it("should handle four times, five times, six times, seven times, eight times, nine times and ten times directives", () => {
    expect(parseDurationLikeString("four times a month")).toBeCloseTo(oneMonth / 4);
    expect(parseDurationLikeString("five times a month")).toBeCloseTo(oneMonth / 5);
    expect(parseDurationLikeString("six times a month")).toBeCloseTo(oneMonth / 6);
    expect(parseDurationLikeString("seven times a month")).toBeCloseTo(oneMonth / 7);
    expect(parseDurationLikeString("eight times a month")).toBeCloseTo(oneMonth / 8);
    expect(parseDurationLikeString("nine times a month")).toBeCloseTo(oneMonth / 9);
    expect(parseDurationLikeString("ten times a month")).toBeCloseTo(oneMonth / 10);

    expect(parseDurationLikeString("four times a week")).toBeCloseTo(oneWeek / 4);
    expect(parseDurationLikeString("five times a week")).toBeCloseTo(oneWeek / 5);
    expect(parseDurationLikeString("six times a week")).toBeCloseTo(oneWeek / 6);
    expect(parseDurationLikeString("seven times a week")).toBeCloseTo(oneWeek / 7);
    expect(parseDurationLikeString("eight times a week")).toBeCloseTo(oneWeek / 8);
    expect(parseDurationLikeString("nine times a week")).toBeCloseTo(oneWeek / 9);
    expect(parseDurationLikeString("ten times a week")).toBeCloseTo(oneWeek / 10);

    expect(parseDurationLikeString("four times a day")).toBeCloseTo(oneDay / 4);
    expect(parseDurationLikeString("five times a day")).toBeCloseTo(oneDay / 5);
    expect(parseDurationLikeString("six times a day")).toBeCloseTo(oneDay / 6);
    expect(parseDurationLikeString("seven times a day")).toBeCloseTo(oneDay / 7);
    expect(parseDurationLikeString("eight times a day")).toBeCloseTo(oneDay / 8);
    expect(parseDurationLikeString("nine times a day")).toBeCloseTo(oneDay / 9);
    expect(parseDurationLikeString("ten times a day")).toBeCloseTo(oneDay / 10);

    expect(parseDurationLikeString("four times an hour")).toBeCloseTo(oneHour / 4);
    expect(parseDurationLikeString("five times an hour")).toBeCloseTo(oneHour / 5);
    expect(parseDurationLikeString("six times an hour")).toBeCloseTo(oneHour / 6);
    expect(parseDurationLikeString("seven times an hour")).toBeCloseTo(oneHour / 7);
    expect(parseDurationLikeString("eight times an hour")).toBeCloseTo(oneHour / 8);
    expect(parseDurationLikeString("nine times an hour")).toBeCloseTo(oneHour / 9);
    expect(parseDurationLikeString("ten times an hour")).toBeCloseTo(oneHour / 10);

    expect(parseDurationLikeString("four times a minute")).toBeCloseTo(oneMinute / 4);
    expect(parseDurationLikeString("five times a minute")).toBeCloseTo(oneMinute / 5);
    expect(parseDurationLikeString("six times a minute")).toBeCloseTo(oneMinute / 6);
    expect(parseDurationLikeString("seven times a minute")).toBeCloseTo(oneMinute / 7);
    expect(parseDurationLikeString("eight times a minute")).toBeCloseTo(oneMinute / 8);
    expect(parseDurationLikeString("nine times a minute")).toBeCloseTo(oneMinute / 9);
    expect(parseDurationLikeString("ten times a minute")).toBeCloseTo(oneMinute / 10);

    expect(parseDurationLikeString("four times a second")).toBeCloseTo(oneSecond / 4);
    expect(parseDurationLikeString("five times a second")).toBeCloseTo(oneSecond / 5);
    expect(parseDurationLikeString("six times a second")).toBeCloseTo(oneSecond / 6);
    expect(parseDurationLikeString("seven times a second")).toBeCloseTo(oneSecond / 7);
    expect(parseDurationLikeString("eight times a second")).toBeCloseTo(oneSecond / 8);
    expect(parseDurationLikeString("nine times a second")).toBeCloseTo(oneSecond / 9);
    expect(parseDurationLikeString("ten times a second")).toBeCloseTo(oneSecond / 10);
  });

  it("should handle short-hand duration strings", () => {
    expect(parseDurationLikeString("1d")).toBe(oneDay);
    expect(parseDurationLikeString("1w")).toBe(oneWeek);
    expect(parseDurationLikeString("1h")).toBe(oneHour);
    expect(parseDurationLikeString("1m")).toBe(oneMinute);
    expect(parseDurationLikeString("1s")).toBe(oneSecond);
    expect(parseDurationLikeString("1ms", { outputUnit: "milliseconds" })).toBe(
      1
    );
  });
  
  it("should handle cardinal numbers", () => {
    expect(parseDurationLikeString("every one months")).toBe(oneMonth);
    expect(parseDurationLikeString("every two months")).toBe(oneMonth * 2);

    expect(parseDurationLikeString("two times a month")).toBeCloseTo(oneMonth / 2);
    expect(parseDurationLikeString("ten times a month")).toBeCloseTo(oneMonth / 10);
  })

  it('should handle simple durations with numbers', () => {
    expect(parseDurationLikeString("1 month")).toBe(oneMonth);
    expect(parseDurationLikeString("2 months")).toBe(oneMonth * 2);
    expect(parseDurationLikeString("3 months")).toBe(oneMonth * 3);
    expect(parseDurationLikeString("4 months")).toBe(oneMonth * 4);
    expect(parseDurationLikeString("5 months")).toBe(oneMonth * 5);
    expect(parseDurationLikeString("6 months")).toBe(oneMonth * 6);
    expect(parseDurationLikeString("7 months")).toBe(oneMonth * 7);
    expect(parseDurationLikeString("8 months")).toBe(oneMonth * 8);
    expect(parseDurationLikeString("9 months")).toBe(oneMonth * 9);
    expect(parseDurationLikeString("10 months")).toBe(oneMonth * 10);
    expect(parseDurationLikeString("11 months")).toBe(oneMonth * 11);
    expect(parseDurationLikeString("12 months")).toBe(oneMonth * 12);

    expect(parseDurationLikeString("1 day")).toBe(oneDay);
    expect(parseDurationLikeString("2 days")).toBe(oneDay * 2);
    expect(parseDurationLikeString("3 days")).toBe(oneDay * 3);
    expect(parseDurationLikeString("4 days")).toBe(oneDay * 4);
    expect(parseDurationLikeString("5 days")).toBe(oneDay * 5);
    expect(parseDurationLikeString("6 days")).toBe(oneDay * 6);
    expect(parseDurationLikeString("7 days")).toBe(oneDay * 7);
    expect(parseDurationLikeString("8 days")).toBe(oneDay * 8);
    expect(parseDurationLikeString("9 days")).toBe(oneDay * 9);
    expect(parseDurationLikeString("10 days")).toBe(oneDay * 10);

    expect(parseDurationLikeString("1 hour")).toBe(oneHour);
    expect(parseDurationLikeString("2 hours")).toBe(oneHour * 2);
    expect(parseDurationLikeString("3 hours")).toBe(oneHour * 3);
    expect(parseDurationLikeString("4 hours")).toBe(oneHour * 4);
    expect(parseDurationLikeString("5 hours")).toBe(oneHour * 5);
    expect(parseDurationLikeString("356 hours")).toBe(oneHour * 356);
  })
});
