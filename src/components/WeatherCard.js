import Card from "./Card";
import Image from "next/image";

function formatTemperature(temperatureC) {
  if (typeof temperatureC !== "number") {
    return "—";
  }

  return `${Math.round(temperatureC)}°C`;
}

// Convert country code → emoji flag
function getFlagEmoji(location) {
  if (!location) return "";

  // Expecting formats like "Edmonton, CA" or "Tokyo, JP"
  const parts = location.split(",");
  const country = parts[1]?.trim();

  if (!country || country.length !== 2) return "";

  // Convert ASCII A-Z to regional indicator symbols
  const codePoints = country
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
}

export default function WeatherCard({ weather, title = "Current weather" }) {
  const hasWeather =
    weather &&
    typeof weather.temperatureC === "number" &&
    Boolean(weather.description);

  const flag = getFlagEmoji(weather?.location);

  return (
    <Card colSpan="md:col-span-1" rowSpan="md:row-span-2" title={title}>
      <div className="flex h-full flex-col justify-between gap-4">
        <p className="text-xs text-neutral-400">
          {flag && <span className="mr-1">{flag}</span>}
          {weather?.location || "Location unavailable"}
        </p>

        {hasWeather ? (
          <div className="flex items-center gap-3">
            {weather.iconUrl ? (
              <Image
                alt={weather.description}
                className="h-16 w-16 object-contain"
                height={64}
                src={weather.iconUrl}
                width={64}
                unoptimized
              />
            ) : null}

            <div className="flex flex-col">
              <p className="text-3xl leading-none font-serif">
                {formatTemperature(weather.temperatureC)}
              </p>
              <p className="text-sm font-light text-neutral-300">
                {weather.description}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm font-light text-neutral-300">
            {weather?.error || "Weather data unavailable."}
          </p>
        )}
      </div>
    </Card>
  );
}
