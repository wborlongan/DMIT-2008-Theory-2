import { http, HttpResponse } from "msw";
import { server } from "../test/msw/server";
import {
  getWeatherForProfile,
  getWeatherLocationFromProfile,
} from "./weather";

describe("getWeatherLocationFromProfile", () => {
  it("prefers weather.location when provided", () => {
    const profile = {
      weather: { location: "Tokyo" },
      timeZone: { zone: "America/Edmonton" },
      contacts: { location: "Somewhere" },
    };

    expect(getWeatherLocationFromProfile(profile)).toBe("Tokyo");
  });

  it("falls back to timezone city when no custom location", () => {
    const profile = {
      timeZone: { zone: "America/Edmonton" },
    };

    expect(getWeatherLocationFromProfile(profile)).toBe("Edmonton");
  });
});

describe("getWeatherForProfile", () => {
  const profile = {
    timeZone: { zone: "America/Edmonton" },
  };

  it("returns a friendly message when API key is missing", async () => {
    const result = await getWeatherForProfile(profile, "");

    expect(result).toEqual({
      location: "Edmonton",
      error:
        "Add your weather API key in local environment settings to show live weather.",
    });
  });

  it("maps OpenWeather success response into UI payload", async () => {
    server.use(
      http.get(
        /https:\/\/api\.openweathermap\.org\/data\/2\.5\/weather.*/,
        () => {
          return HttpResponse.json({
            name: "Edmonton",
            sys: { country: "CA" },
            main: { temp: 7.4 },
            weather: [{ description: "moderate rain", icon: "10d" }],
          });
        }
      )
    );

    const result = await getWeatherForProfile(profile, "test-key");

    expect(result).toEqual({
      location: "Edmonton, CA",
      temperatureC: 7.4,
      description: "Moderate Rain",
      iconUrl: "https://openweathermap.org/img/wn/10d@2x.png",
    });
  });

  it("returns a fallback error when the weather API fails", async () => {
    server.use(
      http.get(
        /https:\/\/api\.openweathermap\.org\/data\/2\.5\/weather.*/,
        () => new HttpResponse(null, { status: 500 })
      )
    );

    const result = await getWeatherForProfile(profile, "test-key");

    expect(result).toEqual({
      location: "Edmonton",
      error: "Unable to load current weather right now.",
    });
  });
});
