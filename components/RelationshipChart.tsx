// FIX: Imported React hooks from 'react' instead of 'recharts'.
import React, { useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Customized } from 'recharts';
import { RatingData } from '../types';
import { formatDateForDisplay } from '../utils/date';
import { EMOJI_MAP } from '../constants';

type SyncLevel = 'none' | 'sync' | 'super-sync' | 'perfect-sync';

interface RelationshipChartProps {
  data: (RatingData & { syncLevel: SyncLevel })[];
  person1Name: string;
  person2Name: string;
  onSyncDayClick: (syncLevel: SyncLevel) => void;
  latestSyncEvent: { date: string; syncLevel: SyncLevel } | null;
  onHoroscopeClick: () => void;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-lg">
        <p className="font-bold text-gray-200">{formatDateForDisplay(label)}</p>
        {payload.map((p: any) => {
          const noteKey = p.dataKey === 'person1' ? 'person1Note' : 'person2Note';
          const note = p.payload[noteKey];
          return (
            <div key={p.name} className="mt-1">
              <p style={{ color: p.color }}>
                {`${p.name}: ${p.value} ${EMOJI_MAP[p.value] || ''}`}
              </p>
              {note && (
                <p className="text-xs text-gray-400 pl-2 mt-0.5 italic max-w-xs whitespace-normal">
                  &ldquo;{note}&rdquo;
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

interface EmojiDotProps {
  cx?: number;
  cy?: number;
  payload?: RatingData;
  personKey: 'person1' | 'person2';
}

const STUTI_IMAGE_URL = 'https://media.licdn.com/dms/image/v2/D5603AQGUPkiYjj0_pA/profile-displayphoto-scale_400_400/B56ZpE_frvJsAg-/0/1762094087592?e=1763596800&v=beta&t=wt1sSG0xNGBWFm19ljZzvU-hB5HL4CkF7mIweiUpGt0';
const ABHISHEK_IMAGE_URL = 'https://media.licdn.com/dms/image/v2/D5603AQHznM-hzXzEGw/profile-displayphoto-shrink_800_800/B56ZRfHIZRH0Ag-/0/1736762493158?e=1763596800&v=beta&t=oi46eJLK6eScPDbMwj_90WPxmvr2S7oyGWuWmcpVMzE';


const EmojiDot: React.FC<EmojiDotProps> = ({ cx, cy, payload, personKey }) => {
    if (cx === undefined || cy === undefined || !payload) return null;
    const rating = payload[personKey];
    if (rating === null || rating === undefined) return null;
    
    const size = 20;
    let imageUrl: string | null = null;

    if (personKey === 'person1') {
        imageUrl = STUTI_IMAGE_URL;
    } else if (personKey === 'person2') {
        imageUrl = ABHISHEK_IMAGE_URL;
    }

    if (imageUrl) {
        return (
            <image
                x={cx - size / 2}
                y={cy - size / 2}
                width={size}
                height={size}
                href={imageUrl}
                clipPath="url(#clipCircle)"
            />
        );
    }
    
    // Fallback to emoji if needed (though not used for person1/2 now)
    const emoji = EMOJI_MAP[rating];
    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="18px" fill="white">
            {emoji}
        </text>
    );
};

const ActiveEmojiDot: React.FC<EmojiDotProps> = ({ cx, cy, payload, personKey }) => {
    if (cx === undefined || cy === undefined || !payload) return null;
    const rating = payload[personKey];
    if (rating === null || rating === undefined) return null;
    
    const size = 28;
    let imageUrl: string | null = null;

    if (personKey === 'person1') {
        imageUrl = STUTI_IMAGE_URL;
    } else if (personKey === 'person2') {
        imageUrl = ABHISHEK_IMAGE_URL;
    }

    if (imageUrl) {
        return (
            <g>
                <circle cx={cx} cy={cy} r={16} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={2} fill="rgba(42, 51, 66, 0.8)" />
                <image
                    x={cx - size / 2}
                    y={cy - size / 2}
                    width={size}
                    height={size}
                    href={imageUrl}
                    clipPath="url(#clipCircle)"
                />
            </g>
        );
    }

    // Fallback to emoji if needed
    const emoji = EMOJI_MAP[rating];

    return (
        <g>
            <circle cx={cx} cy={cy} r={16} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={2} fill="rgba(42, 51, 66, 0.8)" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="22px" fill="white">
                {emoji}
            </text>
        </g>
    );
};

const getLineStyleForSyncLevel = (syncLevel: SyncLevel) => {
  switch (syncLevel) {
    case 'perfect-sync':
      return {
        stroke: 'gold',
        strokeWidth: 2.5,
        strokeOpacity: 0.9,
        strokeDasharray: "",
      };
    case 'super-sync':
      return {
        stroke: 'limegreen',
        strokeWidth: 2,
        strokeOpacity: 0.8,
        strokeDasharray: "",
      };
    case 'sync':
      return {
        stroke: 'white',
        strokeWidth: 1.5,
        strokeOpacity: 0.7,
        strokeDasharray: "",
      };
    default:
      return {
        stroke: 'rgba(107, 114, 128, 0.5)',
        strokeWidth: 1,
        strokeDasharray: "",
      };
  }
};

const ConnectingLines: React.FC<any> = ({ data, xAxisMap, yAxisMap }) => {
  if (!data || !xAxisMap || !yAxisMap) {
    return null;
  }

  const xScale = xAxisMap[0]?.scale;
  const yScale = yAxisMap[0]?.scale;

  if (!xScale || !yScale) {
    return null;
  }

  return (
    <g>
      {data.map((entry: any, index: number) => {
        const { date, person1, person2, syncLevel } = entry;
        
        if (person1 !== null && person2 !== null && person1 !== undefined && person2 !== undefined) {
          const x = xScale(date);
          const y1 = yScale(person1);
          const y2 = yScale(person2);
          const style = getLineStyleForSyncLevel(syncLevel);

          return (
            <line
              key={`line-${index}`}
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              strokeLinecap="round"
              {...style}
            />
          );
        }
        return null;
      })}
    </g>
  );
};


const RelationshipChart: React.FC<RelationshipChartProps> = ({ data, person1Name, person2Name, onSyncDayClick, latestSyncEvent, onHoroscopeClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scroll to the far right to show the latest data points upon rendering
      container.scrollLeft = container.scrollWidth - container.clientWidth;
    }
  }, [data]);
  
  const getIconForSyncLevel = (syncLevel: SyncLevel) => {
      if (syncLevel === 'perfect-sync') return "💎";
      if (syncLevel === 'super-sync') return "🏆";
      if (syncLevel === 'sync') return "🎁";
      return null;
  }

  const icon = latestSyncEvent ? getIconForSyncLevel(latestSyncEvent.syncLevel) : null;
  
  return (
    <div className="relative">
       <div className="absolute top-0 right-0 z-10 flex items-center space-x-2" style={{ transform: 'translate(15%, -25%)' }}>
          <button
              onClick={onHoroscopeClick}
              className="p-2 bg-gray-700 rounded-full shadow-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="See tomorrow's horoscope!"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
          </button>
          {latestSyncEvent && icon && (
              <button
                  onClick={() => onSyncDayClick(latestSyncEvent.syncLevel)}
                  className="p-2 bg-gray-700 rounded-full shadow-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  title={`Special day on ${formatDateForDisplay(latestSyncEvent.date)}! Click to see.`}
              >
                  <span className="text-2xl block w-6 h-6 flex items-center justify-center">{icon}</span>
              </button>
          )}
       </div>
      <div ref={scrollContainerRef} className="w-full overflow-x-auto">
        <div className="min-w-[600px] h-[400px]">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <clipPath id="clipCircle" clipPathUnits="objectBoundingBox">
                  <circle cx="0.5" cy="0.5" r="0.5" />
                </clipPath>
              </defs>
              <CartesianGrid stroke="#4A5568" />
              <XAxis 
                dataKey="date" 
                stroke="#A0AEC0" 
                tickFormatter={formatDateForDisplay}
                minTickGap={20}
              />
              <YAxis 
                stroke="#A0AEC0"
                domain={[-5, 5]}
                ticks={[-5, -3, 0, 3, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="person1" 
                name={person1Name}
                stroke="#2DD4BF" 
                strokeWidth={2}
                activeDot={<ActiveEmojiDot personKey="person1" />}
                dot={<EmojiDot personKey="person1" />}
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="person2" 
                name={person2Name}
                stroke="#D946EF" 
                strokeWidth={2}
                activeDot={<ActiveEmojiDot personKey="person2" />}
                dot={<EmojiDot personKey="person2" />}
                connectNulls 
              />
              <Customized component={ConnectingLines} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RelationshipChart;