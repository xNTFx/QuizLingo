import {
  useCreateReviewsHistoryMutation,
  useUpdateReviewMutation,
} from "../API/Redux/reduxQueryFetch";

export default function useSuperMemo2Implementation() {
  const [updateReview] = useUpdateReviewMutation();
  const [createReviewsHistory] = useCreateReviewsHistoryMutation();

  // Function to calculate the interval (in days) based on the repetition count and ease factor
  function calculateInterval(repetition: number, easeFactor: number): number {
    if (repetition === 1) {
      return 1; // The first interval is always 1 day (i(1))
    }
    if (repetition === 2) {
      return 6; // The second interval is always 6 days (i(2))
    }
    // For n > 2, the interval is calculated as i(n) = i(n-1) * easeFactor
    return Math.ceil(
      calculateInterval(repetition - 1, easeFactor) * easeFactor,
    );
  }

  // Function to add a specified number of days to the current date and format the result as a string
  function addDaysAndGetFormattedDate(days: number): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Implementation of the SuperMemo 2 algorithm
  function superMemo2Implementation(
    reviewId: number, // Unique identifier for the review
    vocabularyId: number, // Identifier for the vocabulary item
    easeFactor: number, // Current ease factor (E-Factor)
    repetition: number, // Current repetition count
    quality: number, // Quality of the response (0-5)
  ) {
    let newEaseFactor = easeFactor;
    let newRepetition = repetition;
    let newInterval = 1;

    if (quality >= 3) {
      // Update ease factor when the quality is 3 or higher
      const newEaseFactorTemp =
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(newEaseFactorTemp, 1.3); // Ensure ease factor does not drop below 1.3
      newRepetition = repetition + 1;
      newInterval = calculateInterval(newRepetition, newEaseFactor); // Calculate the new interval
    } else if (quality > 0) {
      // Restart repetitions from the beginning when quality is between 1 and 2
      newRepetition = 1;
      newInterval = 1; // Set the interval to 1 day
    } else {
      // Completely reset when quality is 0 (full blackout)
      newEaseFactor = 2.5; // Reset ease factor to default
      newRepetition = 1; // Reset repetition to 1
      newInterval = 1; // Set the interval to 1 day
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
      reviewDate: addDaysAndGetFormattedDate(0),
    });
  }

  return superMemo2Implementation;
}
