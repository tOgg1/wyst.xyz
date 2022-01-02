import Input from "./Input";
import React, { useState } from "react";
import "./index.css";
import { parseDurationLikeString, periodLookup } from "./util";

interface FormInput {
  periodicity: string;
  timeSpentEveryTime: string;
  timeSaved: string;
  timeToAutomate: string;
  advancedMode: boolean;
  desiredROIPeriod: string;
  canYouOutsource: boolean;
  outsourceCostPerHour: number;
  yourCostPerHour: number;
}

interface FormErrors {
  periodicity: string | null;
  timeSpentEveryTime: string | null;
  timeSaved: string | null;
  timeToAutomate: string | null;
  desiredROIPeriod: string | null;
  canYouOutsource: string | null;
  outsourceCostPerHour: string | null;
  yourCostPerHour: string | null;
}

type WorthAutomating = "yes" | "no" | "maybe" | "probably" | "probably not";

interface Results {
  worthAutomating: WorthAutomating;
  timeSpent: number;
  timeSaved: number;
  roi: number;
  roiString: string;
}

function App() {
  const [formInput, setFormInput] = useState<FormInput>({
    periodicity: "",
    timeSpentEveryTime: "",
    timeSaved: "",
    timeToAutomate: "",
    advancedMode: false,
    desiredROIPeriod: "",
    canYouOutsource: false,
    outsourceCostPerHour: 0,
    yourCostPerHour: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({
    periodicity: null,
    timeSpentEveryTime: "",
    timeSaved: null,
    timeToAutomate: null,
    desiredROIPeriod: null,
    canYouOutsource: null,
    outsourceCostPerHour: null,
    yourCostPerHour: null,
  });

  const [results, setResults] = useState<Results | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedPeriodicity = parseDurationLikeString(formInput.periodicity);
    const parsedTimeSpentEveryTime = parseDurationLikeString(
      formInput.timeSpentEveryTime
    );
    const parsedTimeSaved = parseDurationLikeString(formInput.timeSaved);
    const parsedTimeToAutomate = parseDurationLikeString(
      formInput.timeToAutomate
    );

    const newErrors: FormErrors = {
      periodicity: null,
      timeSpentEveryTime: null,
      timeSaved: null,
      timeToAutomate: null,
      desiredROIPeriod: null,
      canYouOutsource: null,
      outsourceCostPerHour: null,
      yourCostPerHour: null,
    };

    if (parsedPeriodicity === null) {
      newErrors.periodicity = "Unable to parse";
    }

    if (parsedTimeSpentEveryTime === null) {
      newErrors.timeSpentEveryTime = "Unable to parse";
    }

    if (parsedTimeSaved === null) {
      newErrors.timeSaved = "Unable to parse";
    }

    if (parsedTimeToAutomate === null) {
      newErrors.timeToAutomate = "Unable to parse";
    }

    console.log(
      parsedTimeSaved,
      parsedTimeSpentEveryTime,
      parsedTimeSpentEveryTime! < parsedTimeSaved!
    );

    if (
      parsedTimeSaved &&
      parsedTimeSpentEveryTime &&
      parsedTimeSpentEveryTime < parsedTimeSaved
    ) {
      newErrors.timeSpentEveryTime =
        "Time spent every time must be greater than time saved";
      newErrors.timeSaved =
        "Time saved must be less than time spent every time";
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }  

    const timeSpentEveryYear =
      (parsedTimeSpentEveryTime! * periodLookup["year"]) / parsedPeriodicity!;

    const timeSavedEveryYear =
      (parsedTimeSaved! * periodLookup["year"]) / parsedPeriodicity!;

    const timeUntilRoi =
      parsedTimeToAutomate! / (parsedTimeSaved! / parsedPeriodicity!);

    const monthsUntilRoi = timeUntilRoi / periodLookup["month"];

    let worthAutomating: WorthAutomating = "no";

    if (monthsUntilRoi < 6) {
      worthAutomating = "yes";
    } else if (monthsUntilRoi < 12) {
      worthAutomating = "probably";
    } else if (monthsUntilRoi < 24) {
      worthAutomating = "maybe";
    } else if (monthsUntilRoi < 60) {
      worthAutomating = "probably not";
    }

    let roiString = `${monthsUntilRoi.toFixed(1)} months`;

    if (monthsUntilRoi > 24) {
      roiString = `${(monthsUntilRoi / 12).toFixed(1)} years`;
    } else if (monthsUntilRoi < 1) {
      roiString = `${(timeUntilRoi / periodLookup["day"]).toFixed()} days`;
    }

    setResults({
      worthAutomating,
      timeSpent: timeSpentEveryYear,
      timeSaved: timeSavedEveryYear,
      roi: timeUntilRoi,
      roiString,
    });
  }

  return (
    <main className="container mx-auto p-4">
      <header>
        <h1 className="text-4xl mt-8">Will you save time?</h1>
        <h3 className="mt-2">
          Use the simple calculator below to figure out whether or not you are
          going to save time automating a task.
        </h3>
      </header>
      <section id="input" className="mt-8 max-w-md">
        <form
          action="#"
          className="grid grid-cols-1 gap-6"
          onSubmit={handleSubmit}
        >
          <label htmlFor="periodicity" className="block">
            <div className="text-gray-600">How often do you do your task?</div>
            <Input
              id="periodicity"
              value={formInput.periodicity}
              onChange={(newValue) =>
                setFormInput({ ...formInput, periodicity: newValue })
              }
              placeholder="every month"
            />
            {errors.periodicity && (
              <div className="text-red-600 text-sm mt-1">
                {errors.periodicity}
              </div>
            )}
          </label>
          <label htmlFor="timeSaved" className="block">
            <div className="text-gray-600">
              How much time does it take to do your task?
            </div>
            <Input
              id="timeSaved"
              value={formInput.timeSpentEveryTime}
              onChange={(newValue) =>
                setFormInput({ ...formInput, timeSpentEveryTime: newValue })
              }
              placeholder="30 minutes"
            />
            {errors.timeSpentEveryTime && (
              <div className="text-red-600 text-sm mt-1">
                {errors.timeSpentEveryTime}
              </div>
            )}
          </label>
          <label htmlFor="timeSaved" className="block">
            <div className="text-gray-600">
              How much of this will you save by automating it?
            </div>
            <Input
              id="timeSaved"
              value={formInput.timeSaved}
              onChange={(newValue) =>
                setFormInput({ ...formInput, timeSaved: newValue })
              }
              placeholder="30 minutes"
            />
            {errors.timeSaved && (
              <div className="text-red-600 text-sm mt-1">
                {errors.timeSaved}
              </div>
            )}
          </label>
          <label htmlFor="timeSpent" className="block">
            <div className="text-gray-600">
              How long will it take you to automate your task?
            </div>
            <Input
              id="timeToAutomate"
              value={formInput.timeToAutomate}
              onChange={(newValue) =>
                setFormInput({ ...formInput, timeToAutomate: newValue })
              }
              placeholder="4 hours"
            />
            {errors.timeToAutomate && (
              <div className="text-red-600 text-sm mt-1">
                {errors.timeToAutomate}
              </div>
            )}
          </label>
          {/* <label htmlFor="advancedMode" className="inline-flex items-center">
            <Checkbox
              id="advancedMode"
              checked={formInput.advancedMode}
              onChange={(newValue) =>
                setFormInput({ ...formInput, advancedMode: newValue })
              }
            />
            <div className="ml-2 text-gray-600">Adavanced mode</div>
          </label> */}
          <button
            type="submit"
            className="rounded bg-indigo-600 text-white h-12"
          >
           Is it time to automate?
          </button>
        </form>
      </section>
      <section id="results" className="mt-20 mb-40">
        {results && (
          <>
            <h1 className="text-4xl">Results</h1>

            {results.worthAutomating === "no" && (
              <h2 className="p-6 text-lg bg-red-300 text-red-900 rounded-lg mt-8 inline-block">
                You should not automate your task.
                <p className="text-sm">
                  It will take {results.roiString} to make up for time invested
                  into automation.
                </p>
              </h2>
            )}

            {results.worthAutomating === "probably not" && (
              <h2 className="p-6 text-lg bg-orange-300 text-orange-900 rounded-lg mt-8 inline-block">
                You should probably not automate your task.
                <p className="text-sm">
                  It will take {results.roiString} to make up for time invested
                  into automation.
                </p>
              </h2>
            )}

            {results.worthAutomating === "maybe" && (
              <h2 className="p-6 text-lg bg-yellow-100 text-yellow-900 rounded-lg mt-8 inline-block">
                You should probably automate your task.
                <p className="text-sm">
                  It will take {results.roiString} to make up for time invested
                  into automation.
                </p>
              </h2>
            )}

            {results.worthAutomating === "probably" && (
              <h2 className="p-6 text-lg bg-green-100 text-green-900 rounded-lg mt-8 inline-block">
                You should likely automate your task.
                <p className="text-sm">
                  It will take {results.roiString} to make up for time invested
                  into automation.
                </p>
              </h2>
            )}

            {results.worthAutomating === "yes" && (
              <h2 className="p-6 text-lg bg-indigo-300 text-indigo-900 rounded-lg mt-8 inline-block">
                You should definitely automate your task.
                <p className="text-sm">
                  It will take {results.roiString} to make up for time invested
                  into automation.
                </p>
              </h2>
            )}

            <p className="text-md mt-8 text-gray-600">
              You are spending{" "}
              {(results.timeSpent / periodLookup["hours"]).toFixed(1)} hours
              every year on your task.
            </p>

            <p className="text-md mt-2 text-gray-600">
              You are going to save {(results.timeSaved / 3600000).toFixed(1)}{" "}
              hours every year if you automate it.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
