// Select the HTML element to display the joke setup
const setupElement = document.getElementById('joke-setup');

// Select the HTML element to display the joke punchline
const punchlineElement = document.getElementById('joke-punchline');

// Select the button that generates a random joke
const generateButton = document.getElementById('generate');

// Select the button that resets the joke history
const resetButton = document.getElementById('reset');

// Select the loading message element
const loadingElement = document.getElementById('loading');

// Key to store jokes in localStorage
const LOCAL_STORAGE_KEY = 'displayedJokes';

// Retrieve the jokes already shown from localStorage or start with an empty list
const displayedJokes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

// Function to save the displayed jokes array into localStorage
function saveDisplayedJokes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(displayedJokes));
}

// Function to fetch a random joke from the API
async function fetchJoke() {
  try {
    // Fetch a random joke from the API
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the response into JSON format
    const data = await response.json();

    // Return the joke setup and punchline as an object
    return { setup: data.setup, punchline: data.punchline };
  } catch (error) {
    console.error('Error fetching joke:', error);
    throw new Error('Failed to fetch joke');
  }
}

// Function to check if a joke is new (not already displayed)
function isNewJoke(joke) {
  return !displayedJokes.some(
    (prevJoke) => prevJoke.setup === joke.setup && prevJoke.punchline === joke.punchline
  );
}

// Add functionality to the "Generate Joke" button
generateButton.addEventListener('click', async () => {
  // Show the loading message
  loadingElement.style.display = 'block';

  // Placeholder text while fetching
  setupElement.textContent = '...';
  punchlineElement.textContent = '';

  try {
    let joke;
    do {
      // Keep fetching a joke until it's a new one
      joke = await fetchJoke();
    } while (!isNewJoke(joke));

    // Add the new joke to the displayedJokes array
    displayedJokes.push(joke);

    // Save the updated jokes array to localStorage
    saveDisplayedJokes();

    // Display the new joke
    setupElement.textContent = joke.setup;
    punchlineElement.textContent = joke.punchline;
  } catch (error) {
    // Show an error message if fetching fails
    setupElement.textContent = 'Oops!';
    punchlineElement.textContent = 'Failed to fetch a joke. Please try again!';
  } finally {
    // Hide the loading message
    loadingElement.style.display = 'none';
  }
});

// Add functionality to the "Reset Jokes" button
resetButton.addEventListener('click', () => {
  // Clear jokes from localStorage
  localStorage.removeItem(LOCAL_STORAGE_KEY);

  // Reset the displayedJokes array
  displayedJokes.length = 0;

  // Alert the user
  alert('Joke history reset!');
});
