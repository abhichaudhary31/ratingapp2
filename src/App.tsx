import React, { useState, useEffect } from 'react';
import { subscribeToRatings, saveRating } from './services/firebaseService';
import { RatingData } from './types';
import Header from './components/Header';
import RelationshipChart from './components/RelationshipChart';
import RatingInput from './components/RatingInput';
import CelebrationModal from './components/CelebrationModal';
import GifModal from './components/GifModal';
import { getCurrentDateString } from './utils/date';
import { SYNC_DAY_GIF_URL, SUPER_SYNC_DAY_GIF_URL, PERFECT_DAY_GIF_URL } from './constants';
import { getHoroscope } from './services/geminiService';
import HoroscopeModal from './components/HoroscopeModal';

type SyncLevel = 'none' | 'sync' | 'super-sync' | 'perfect-sync';

const App: React.FC = () => {
  const [data, setData] = useState<RatingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [person1Name, setPerson1Name] = useState('Stuti');
  const [person2Name, setPerson2Name] = useState('Abhishek');
  const [celebrationContent, setCelebrationContent] = useState<{gif: string; title: string; message: string} | null>(null);
  const [gifModalUrl, setGifModalUrl] = useState<string | null>(null);
  
  const [isHoroscopeModalOpen, setIsHoroscopeModalOpen] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<{stuti: string; abhishek: string} | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [horoscopeError, setHoroscopeError] = useState<string | null>(null);


  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToRatings((ratings) => {
      setData(ratings);
      setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => {
      console.log('Unsubscribing from ratings.');
      unsubscribe();
    };
  }, []);

  const handleSaveRating = async (person: 'person1' | 'person2', rating: number, note: string) => {
    const today = getCurrentDateString();
    try {
      await saveRating(today, person, rating, note);

      // Optimistic update to check for celebration immediately.
      // The real-time listener will soon sync this with the backend truth.
      setData(prevData => {
        const todayIndex = prevData.findIndex(d => d.date === today);
        const newData = [...prevData];
        let updatedTodaysData: RatingData | undefined;

        if (todayIndex > -1) {
          // Update existing entry
          const existingData = newData[todayIndex];
          newData[todayIndex] = { ...existingData, [person]: rating, [`${person}Note`]: note };
          updatedTodaysData = newData[todayIndex];
        } else {
          // Add new entry
          const newEntry: RatingData = {
            date: today,
            person1: null,
            person2: null,
            [person]: rating,
            [`${person}Note`]: note,
          };
          newData.push(newEntry);
          // Sort data by date after adding a new entry
          newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          updatedTodaysData = newEntry;
        }

        // Check for celebration condition
        if (updatedTodaysData && updatedTodaysData.person1 !== null && updatedTodaysData.person2 !== null) {
          if (updatedTodaysData.person1 === 5 && updatedTodaysData.person2 === 5) {
            setCelebrationContent({
              gif: PERFECT_DAY_GIF_URL,
              title: "A Perfect Day!",
              message: "An absolutely perfect day for both of you. This is true bliss!"
            });
          } else if (updatedTodaysData.person1 >= 4 && updatedTodaysData.person2 >= 4) {
            setCelebrationContent({
              gif: SUPER_SYNC_DAY_GIF_URL,
              title: "Perfect Harmony!",
              message: "You're both on an incredible high today! Amazing!"
            });
          } else if (updatedTodaysData.person1 >= 3 && updatedTodaysData.person2 >= 3) {
            setCelebrationContent({
              gif: SYNC_DAY_GIF_URL,
              title: "Soulmate Sync!",
              message: "You're both on the same amazing wavelength today!"
            });
          }
        }

        return newData;
      });
    } catch (err) {
      setError('Failed to save rating.');
    }
  };

  const getTodaysRating = (person: 'person1' | 'person2'): number | undefined => {
      const today = getCurrentDateString();
      const todayData = data.find(d => d.date === today);
      if(!todayData) return undefined;
      const rating = todayData[person];
      return rating === null ? undefined : rating;
  }

  const getTodaysNote = (person: 'person1' | 'person2'): string | undefined => {
      const today = getCurrentDateString();
      const todayData = data.find(d => d.date === today);
      if(!todayData) return undefined;
      const note = person === 'person1' ? todayData.person1Note : todayData.person2Note;
      return note === null ? undefined : note;
  }
  
  const handleSyncDayClick = (syncLevel: SyncLevel) => {
    if (syncLevel === 'perfect-sync') {
      setGifModalUrl(PERFECT_DAY_GIF_URL);
    } else if (syncLevel === 'super-sync') {
      setGifModalUrl(SUPER_SYNC_DAY_GIF_URL);
    } else if (syncLevel === 'sync') {
      setGifModalUrl(SYNC_DAY_GIF_URL);
    }
  };

  const handleHoroscopeClick = async () => {
    setIsHoroscopeModalOpen(true);
    setIsHoroscopeLoading(true);
    setHoroscopeError(null);
    setHoroscopeData(null); // Clear previous data
    try {
        // Using Promise.all to fetch both horoscopes concurrently
        const [stutiHoroscope, abhishekHoroscope] = await Promise.all([
            getHoroscope('Pisces'),
            getHoroscope('Leo')
        ]);
        setHoroscopeData({ stuti: stutiHoroscope, abhishek: abhishekHoroscope });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setHoroscopeError(errorMessage);
        console.error(err);
    } finally {
        setIsHoroscopeLoading(false);
    }
  };

  const chartData = data.map(d => {
    let syncLevel: SyncLevel = 'none';
    if (d.person1 !== null && d.person2 !== null) {
      if (d.person1 === 5 && d.person2 === 5) {
        syncLevel = 'perfect-sync';
      } else if (d.person1 >= 4 && d.person2 >= 4) {
        syncLevel = 'super-sync';
      } else if (d.person1 >= 3 && d.person2 >= 3) {
        syncLevel = 'sync';
      }
    }
    return { ...d, syncLevel };
  });

  const latestSyncEvent = [...chartData]
    .reverse()
    .find(d => d.syncLevel !== 'none') || null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <Header />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Our Journey</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-96 text-red-400">{error}</div>
            ) : (
              <RelationshipChart 
                data={chartData} 
                person1Name={person1Name} 
                person2Name={person2Name}
                onSyncDayClick={handleSyncDayClick}
                latestSyncEvent={latestSyncEvent ? { date: latestSyncEvent.date, syncLevel: latestSyncEvent.syncLevel } : null}
                onHoroscopeClick={handleHoroscopeClick}
              />
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <RatingInput 
              personName={person1Name}
              personKey="person1"
              onSave={handleSaveRating}
              color="teal"
              initialRating={getTodaysRating('person1')}
              initialNote={getTodaysNote('person1')}
            />
            <RatingInput
              personName={person2Name}
              personKey="person2"
              onSave={handleSaveRating}
              color="fuchsia"
              initialRating={getTodaysRating('person2')}
              initialNote={getTodaysNote('person2')}
            />
          </div>
        </main>
      </div>
      <CelebrationModal 
        isOpen={!!celebrationContent} 
        onClose={() => setCelebrationContent(null)} 
        gifUrl={celebrationContent?.gif}
        title={celebrationContent?.title}
        message={celebrationContent?.message}
      />
      <GifModal isOpen={!!gifModalUrl} onClose={() => setGifModalUrl(null)} gifUrl={gifModalUrl} />
       <HoroscopeModal
          isOpen={isHoroscopeModalOpen}
          onClose={() => setIsHoroscopeModalOpen(false)}
          horoscopes={horoscopeData}
          isLoading={isHoroscopeLoading}
          error={horoscopeError}
        />
    </div>
  );
};

export default App;