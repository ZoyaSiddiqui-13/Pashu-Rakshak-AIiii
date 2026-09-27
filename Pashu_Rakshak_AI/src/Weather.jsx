import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

const DEFAULT_LOCATION = {
  name: "Palghar",
  latitude: 19.6967,
  longitude: 72.765,
};

const WEATHER_CODE_MAP = {
  0: { label: "Clear sky", icon: CloudSun },
  1: { label: "Mainly clear", icon: CloudSun },
  2: { label: "Partly cloudy", icon: CloudSun },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Fog", icon: Cloud },
  48: { label: "Depositing rime fog", icon: Cloud },
  51: { label: "Light drizzle", icon: CloudDrizzle },
  53: { label: "Moderate drizzle", icon: CloudDrizzle },
  55: { label: "Dense drizzle", icon: CloudDrizzle },
  56: { label: "Light freezing drizzle", icon: CloudDrizzle },
  57: { label: "Dense freezing drizzle", icon: CloudDrizzle },
  61: { label: "Slight rain", icon: CloudRain },
  63: { label: "Moderate rain", icon: CloudRain },
  65: { label: "Heavy rain", icon: CloudRain },
  66: { label: "Light freezing rain", icon: CloudRain },
  67: { label: "Heavy freezing rain", icon: CloudRain },
  71: { label: "Slight snowfall", icon: Cloud },
  73: { label: "Moderate snowfall", icon: Cloud },
  75: { label: "Heavy snowfall", icon: Cloud },
  77: { label: "Snow grains", icon: Cloud },
  80: { label: "Slight rain showers", icon: CloudRain },
  81: { label: "Moderate rain showers", icon: CloudRain },
  82: { label: "Violent rain showers", icon: CloudRain },
  85: { label: "Slight snow showers", icon: Cloud },
  86: { label: "Heavy snow showers", icon: Cloud },
  95: { label: "Thunderstorm", icon: CloudRain },
  96: { label: "Thunderstorm with hail", icon: CloudRain },
  99: { label: "Thunderstorm with heavy hail", icon: CloudRain },
};

const FALLBACK_WEATHER = {
  temperature: 29,
  apparentTemperature: 31,
  humidity: 76,
  windSpeed: 12,
  precipitation: 1.2,
  weatherCode: 63,
  observedAt: "Demo data",
  isFallback: true,
};

function calculateRisk({ temperature, humidity, precipitation, windSpeed }) {
  let score = 0;
  const factors = [];

  if (humidity >= 85) {
    score += 28;
    factors.push("Very high humidity");
  } else if (humidity >= 75) {
    score += 20;
    factors.push("High humidity");
  } else if (humidity >= 65) {
    score += 10;
    factors.push("Moderate humidity");
  }

  if (temperature >= 36) {
    score += 25;
    factors.push("High heat");
  } else if (temperature >= 32) {
    score += 16;
    factors.push("Warm conditions");
  } else if (temperature <= 12) {
    score += 14;
    factors.push("Low temperature");
  }

  if (precipitation >= 8) {
    score += 28;
    factors.push("Heavy precipitation");
  } else if (precipitation >= 3) {
    score += 18;
    factors.push("Wet conditions");
  } else if (precipitation >= 1) {
    score += 8;
    factors.push("Recent precipitation");
  }

  if (windSpeed >= 30) {
    score += 15;
    factors.push("High wind");
  }

  score = Math.min(100, Math.round(score));

  let level = "Low";
  let tone = "emerald";

  if (score >= 70) {
    level = "Critical";
    tone = "red";
  } else if (score >= 45) {
    level = "High";
    tone = "orange";
  } else if (score >= 25) {
    level = "Medium";
    tone = "amber";
  }

  if (factors.length === 0) {
    factors.push("No major weather stress signals detected");
  }

  return { score, level, tone, factors };
}

export default function Weather() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION.name);
  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sourceMessage, setSourceMessage] = useState("");

  const fetchWeather = useCallback(
    async (useFallbackOnError = true) => {
      setError("");
      setSourceMessage("");

      try {
        const params = new URLSearchParams({
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
          timezone: "auto",
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Weather API returned ${response.status}`);
        }

        const data = await response.json();

        const current = data?.current;

        if (
          !current ||
          typeof current.temperature_2m !== "number" ||
          typeof current.relative_humidity_2m !== "number" ||
          typeof current.weather_code !== "number"
        ) {
          throw new Error("Weather API returned an invalid response.");
        }

        const nextWeather = {
          temperature: Number(current.temperature_2m),
          apparentTemperature:
            typeof current.apparent_temperature === "number"
              ? Number(current.apparent_temperature)
              : Number(current.temperature_2m),
          humidity: Number(current.relative_humidity_2m),
          windSpeed:
            typeof current.wind_speed_10m === "number"
              ? Number(current.wind_speed_10m)
              : 0,
          precipitation:
            typeof current.precipitation === "number"
              ? Number(current.precipitation)
              : 0,
          weatherCode: Number(current.weather_code),
          observedAt: current.time || "Current",
          isFallback: false,
        };

        setWeather(nextWeather);
        setRisk(calculateRisk(nextWeather));
        setSourceMessage("Live weather data loaded.");
      } catch (err) {
        const fallback = calculateRisk(FALLBACK_WEATHER);

        setError(
          "Live weather data is temporarily unavailable. Showing safe demo weather data instead."
        );

        if (useFallbackOnError) {
          setWeather(FALLBACK_WEATHER);
          setRisk(fallback);
          setSourceMessage("Fallback demo data is active.");
        } else {
          setWeather(null);
          setRisk(null);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [location]
  );

  useEffect(() => {
    setLoading(true);
    fetchWeather(true);
  }, [fetchWeather]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWeather(true);
  };

  const handleUseBrowserLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          name: "Current Location",
          latitude: Number(position.coords.latitude),
          longitude: Number(position.coords.longitude),
        });
        setLocationName("Current Location");
      },
      () => {
        setError(
          "Location access was not available. Continuing with the selected district."
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };

  const weatherMeta = WEATHER_CODE_MAP[weather?.weatherCode] || WEATHER_CODE_MAP[3];
  const WeatherIcon = weatherMeta.icon;

  const riskTone = {
    emerald: {
      card: "border-emerald-200 bg-emerald-50",
      text: "text-emerald-700",
      bar: "bg-emerald-500",
    },
    amber: {
      card: "border-amber-200 bg-amber-50",
      text: "text-amber-700",
      bar: "bg-amber-500",
    },
    orange: {
      card: "border-orange-200 bg-orange-50",
      text: "text-orange-700",
      bar: "bg-orange-500",
    },
    red: {
      card: "border-red-200 bg-red-50",
      text: "text-red-700",
      bar: "bg-red-500",
    },
  }[risk?.tone || "emerald"];

  const lastUpdated = useMemo(() => {
    if (!weather || weather.isFallback) return "Demo fallback";
    return weather.observedAt;
  }, [weather]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck size={14} />
                WEATHER & RISK INTELLIGENCE
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Weather Health Intelligence
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Weather conditions are combined with simple environmental
                signals to support livestock disease-risk monitoring.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUseBrowserLocation}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <MapPin size={16} />
                Use My Location
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={18} />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mb-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Current Conditions
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <MapPin size={17} className="text-emerald-600" />
                  <h2 className="text-xl font-extrabold">{locationName}</h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>

              {weather && !loading && (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <WeatherIcon size={29} />
                </div>
              )}
            </div>

            {loading ? (
              <div className="mt-10 animate-pulse">
                <div className="h-12 w-40 rounded-xl bg-slate-100" />
                <div className="mt-4 h-5 w-48 rounded-lg bg-slate-100" />
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-24 rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              </div>
            ) : weather ? (
              <>
                <div className="mt-8 flex flex-wrap items-end gap-4">
                  <div>
                    <div className="text-5xl font-extrabold tracking-tight">
                      {Math.round(weather.temperature)}°C
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-600">
                      {weatherMeta.label}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Feels like
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      {Math.round(weather.apparentTemperature)}°C
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric
                    icon={Droplets}
                    label="Humidity"
                    value={`${Math.round(weather.humidity)}%`}
                  />
                  <Metric
                    icon={Wind}
                    label="Wind"
                    value={`${Math.round(weather.windSpeed)} km/h`}
                  />
                  <Metric
                    icon={CloudRain}
                    label="Precipitation"
                    value={`${weather.precipitation.toFixed(1)} mm`}
                  />
                  <Metric
                    icon={Thermometer}
                    label="Heat Index Input"
                    value={`${Math.round(weather.apparentTemperature)}°C`}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Updated: {lastUpdated}</span>
                  <span>{sourceMessage}</span>
                </div>
              </>
            ) : (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <Cloud size={30} className="mx-auto text-slate-400" />
                <p className="mt-3 text-sm font-bold text-slate-700">
                  Weather data unavailable
                </p>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            )}
          </section>

          <section className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${riskTone.card}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${riskTone.text}`}>
                  Weather-Based Disease Risk
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {risk?.level || "Loading"}
                </h2>
                <p className="mt-1 max-w-md text-sm leading-6 text-slate-600">
                  This is an environmental screening signal, not a veterinary
                  diagnosis.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70">
                <Leaf className={riskTone.text} size={28} />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Risk score</span>
                <span>{risk?.score ?? 0}/100</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${riskTone.bar}`}
                  style={{ width: `${risk?.score ?? 0}%` }}
                />
              </div>
            </div>

            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Contributing signals
              </p>

              <div className="mt-3 space-y-2">
                {(risk?.factors || ["Calculating environmental signals..."]).map(
                  (factor) => (
                    <div
                      key={factor}
                      className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      <span className={`h-2 w-2 rounded-full ${riskTone.bar}`} />
                      {factor}
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <InsightCard
            icon={Droplets}
            title="Humidity Watch"
            text="High humidity can support moisture-sensitive disease environments and should be considered with clinical and field observations."
          />
          <InsightCard
            icon={CloudRain}
            title="Rainfall Watch"
            text="Rain and wet conditions may affect animal housing, sanitation, waterlogging and field accessibility."
          />
          <InsightCard
            icon={Wind}
            title="Field Conditions"
            text="Wind and weather changes can influence field response plans, transport and outdoor sample collection."
          />
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Decision Support Notice</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Weather-based risk is one input to disease surveillance. It
                should be combined with animal symptoms, health records,
                geographic patterns, field investigation and veterinary review
                before treatment or public-health action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <Icon size={17} className="text-emerald-600" />
      <p className="mt-3 text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold">{value}</p>
    </div>
  );
}

function InsightCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={19} />
      </div>
      <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}
