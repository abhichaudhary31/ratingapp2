import { collection, doc, setDoc, onSnapshot, Unsubscribe, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { RatingData } from '../types';

const ratingsCollectionRef = collection(db, 'ratings');

/**
 * Sets up a real-time listener for the 'ratings' collection, ordered by date.
 * The callback will be invoked immediately with the current data and then
 * again whenever the data changes.
 * Returns an unsubscribe function to clean up the listener.
 */
export const subscribeToRatings = (callback: (ratings: RatingData[]) => void): Unsubscribe => {
  console.log('Subscribing to real-time rating updates...');
  const q = query(ratingsCollectionRef, orderBy('__name__'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const ratingList: RatingData[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        date: doc.id,
        person1: data.person1 !== undefined ? data.person1 : null,
        person2: data.person2 !== undefined ? data.person2 : null,
        person1Note: data.person1Note || null,
        person2Note: data.person2Note || null,
      };
    });
    callback(ratingList);
  }, (error) => {
    console.error("Error listening to ratings collection: ", error);
  });

  return unsubscribe;
};


/**
 * Saves or updates a rating and note for a specific person on a specific date in Firestore.
 * It uses the date as the document ID.
 */
export const saveRating = async (date: string, person: 'person1' | 'person2', rating: number, note: string): Promise<void> => {
  console.log(`Saving rating for ${person} on ${date} with value ${rating} and note to Firestore...`);
  const ratingDocRef = doc(db, 'ratings', date);
  const noteKey = person === 'person1' ? 'person1Note' : 'person2Note';
  // Use { merge: true } to create the document if it doesn't exist, or update it if it does.
  await setDoc(ratingDocRef, { [person]: rating, [noteKey]: note }, { merge: true });
};