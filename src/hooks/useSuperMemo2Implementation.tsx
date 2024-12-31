import {
  useCreateReviewsHistoryMutation,
  useUpdateReviewMutation,
} from "../API/Redux/reduxQueryFetch";
import addDaysAndGetFormattedDate from "../utils/addDaysAndGetFormattedDate";

export default function useSuperMemo2Implementation() {
  const [updateReview] = useUpdateReviewMutation();
  const [createReviewsHistory] = useCreateReviewsHistoryMutation();

  // Function to calculate the interval (in days) based on the repetition count and ease factor
  function calculateInterval(
    lastInterval: number,
    repetition: number,
    easeFactor: number,
  ): number {
    if (repetition === 1) return 1; // The first interval is always 1 day
    if (repetition === 2) return 6; // The second interval is always 6 days
    return Math.ceil(lastInterval * easeFactor); // For n > 2: I(n) = I(n-1) * EF
  }

  // Implementation of the SuperMemo 2 algorithm
  function superMemo2Implementation(
    reviewId: number, // Unique identifier for the review
    vocabularyId: number, // Identifier for the vocabulary item
    easeFactor: number, // Current ease factor (E-Factor)
    repetition: number, // Current repetition count
    quality: number, // Quality of the response (0-5)
  ): void {
    let newEaseFactor: number = easeFactor;
    let newRepetition: number = repetition;
    let newInterval: number = 1;

    // Update ease factor based on quality (applies to all cases)
    const newEaseFactorTemp =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(newEaseFactorTemp, 1.3); // Ensure ease factor does not drop below 1.3

    if (quality < 1) {
      // Reset repetitions for quality < 1
      newRepetition = 1; // Start repetition count from 1
      newInterval = calculateInterval(1, newRepetition, newEaseFactor); // Use I(1) interval
    } else {
      // Increment repetition and calculate the new interval
      newRepetition = repetition + 1;
      newInterval = calculateInterval(newInterval, newRepetition, newEaseFactor);
    }

    // Update the review with the new values
    updateReview({
      reviewId,
      vocabularyId,
      reviewDate: addDaysAndGetFormattedDate(newInterval),
      easeFactor: newEaseFactor,
      repetition: newRepetition,
    });

    // Create a review history entry to track the review attempt
    createReviewsHistory({
      vocabularyId,
      easeFactor: newEaseFactor,
      quality,
      repetition,
      reviewDate: addDaysAndGetFormattedDate(0),
    });
  }

  return superMemo2Implementation;
}
