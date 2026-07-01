'use client';

import { useEffect, useState } from 'react';

interface Weather {
  airTemp: number;
  seaTemp: number;
  windSpeed: number;
  waveHeight: number;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const [airRes, seaRes] = await Promise.all([
          fetch('https://api.open-meteo.com/v1/forecast?latitude=44.5&longitude=34.17&current=temperature_2m,wind_speed_10m&wind_speed_unit=ms'),
          fetch('https://marine-api.open-meteo.com/v1/marine?latitude=44.5&longitude=34.17&current=sea_surface_temperature,wave_height'),
        ]);
        const [airData, seaData] = await Promise.all([airRes.json(), seaRes.json()]);
        setWeather({
          airTemp: Math.round(airData.current.temperature_2m),
          windSpeed: Math.round(airData.current.wind_speed_10m),
          seaTemp: Math.round(seaData.current.sea_surface_temperature),
          waveHeight: Math.round(seaData.current.wave_height * 10) / 10,
        });
      } catch {
        // silent fail — виджет просто не показывается
      }
    }
    fetchWeather();
  }, []);

  if (!weather) return null;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {[
        {
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.5 2.8-1.3 3.8L12 22l-2.7-12.2A5.9 5.9 0 0 1 8 6a4 4 0 0 1 4-4z"/>
              <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          ),
          label: 'Воздух',
          value: `${weather.airTemp}°C`,
        },
        {
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6c0 0 4-3 9-3s9 3 9 3M3 18c0 0 4 3 9 3s9-3 9-3"/>
            </svg>
          ),
          label: 'Море',
          value: `${weather.seaTemp}°C`,
        },
        {
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
            </svg>
          ),
          label: 'Ветер',
          value: `${weather.windSpeed} м/с`,
        },
        {
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2"/>
              <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2"/>
              <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2"/>
            </svg>
          ),
          label: 'Волна',
          value: `${weather.waveHeight} м`,
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white"
        >
          <span className="opacity-70">{item.icon}</span>
          <span className="text-[11px] text-white/60 hidden sm:inline">{item.label}</span>
          <span className="text-sm font-semibold">{item.value}</span>
        </div>
      ))}

      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-white/50">Ялта, сейчас</span>
      </div>
    </div>
  );
}
