function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateDailyRandomNumber(min, max) {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);

  // Use the day of the year as the seed
  const seed = dayOfYear; 

  // Generate a pseudo-random number using the seed
  const randomValue = seededRandom(seed);

  // Scale the random value to the desired range
  return Math.floor(randomValue * (max - min + 1)) + min;
}


function getDaysSince(specificDateString) {
    const pastDate = new Date(specificDateString);
    const currentDate = new Date();

    // Set both dates to midnight to avoid issues with time differences impacting day count
    pastDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const timeDifferenceMs = Math.abs(currentDate.getTime() - pastDate.getTime());
    const oneDayMs = 1000 * 60 * 60 * 24;
    const daysSince = Math.floor(timeDifferenceMs / oneDayMs);

    return daysSince;
}