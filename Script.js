let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
  let speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  speech.lang = "hi-GB"; // Change this to your desired language code. For example, "en-US" for English.
  window.speechSynthesis.speak(speech);
}

function wishMe() {
  let day = new Date();
  let hour = day.getHours();
  if (hour >= 0 && hour < 12) {
    speak("Good Morning! sir");
  } else if (hour >= 12 && hour < 16) {
    speak("Good Afternoon! sir");
  } else {
    speak("Good Evening! sir");
  }
}
window.addEventListener("load", () => {
  wishMe();
});
let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new speechRecognition();
recognition.onresult = (event) => {
  let currentIndex = event.resultIndex;
  let transcript = event.results[currentIndex][0].transcript;
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  voice.style.display = "block";
});

async function takeCommand(message) {
  btn.style.display = "flex";
  voice.style.display = "none";

  message = message.toLowerCase().trim(); // Normalize input to lowercase

  const OPENWEATHER_API_KEY = "22542deb0913a448140c18d28f28bf7f"; // Replace with your OpenWeatherMap API key

  function openUrlInNewTab(url) {
    window.open(url, "_blank");
  }

  async function fetchWeather(city) {
    try {
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      if (response.ok) {
        let data = await response.json();
        let weather = data.weather[0].description;
        let temperature = data.main.temp;
        speak(
          `The weather in ${city} is currently ${weather} with a temperature of ${temperature} degrees Celsius.`
        );
      } else {
        speak(`I couldn't fetch the weather for ${city}. Please try again.`);
      }
    } catch (error) {
      speak("An error occurred while fetching the weather.");
      console.error(error);
    }
  }

  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello sir, what can I help you with?");
  } else if (message.includes("who are you") || message.includes("hu r u")) {
    speak(
      "I am a virtual assistant created by Shriyansh Kumar. I can help you with tasks like searching for information, playing music, and setting reminders."
    );
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube...");
    openUrlInNewTab("https://www.youtube.com/");
  } else if (message.includes("open google")) {
    speak("Opening Google...");
    openUrlInNewTab("https://www.google.com/");
  } else if (message.includes("play music")) {
    let musicQuery = message.replace("play music", "").trim();
    if (musicQuery) {
      speak(`Playing ${musicQuery} on YouTube`);
      openUrlInNewTab(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          musicQuery
        )}`
      );
    } else {
      speak("Please specify the music you'd like to play.");
    }
  } else if (message.includes("remind me to")) {
    let reminder = message.split("remind me to")[1].trim();
    if (reminder) {
      speak(`I will remind you to ${reminder}`);
    } else {
      speak("Please specify what you'd like to be reminded about.");
    }
  } else if (message.includes("time")) {
    let now = new Date();
    speak(`The current time is ${now.toLocaleTimeString()}`);
  } else if (message.includes("date")) {
    let today = new Date();
    speak(`Today's date is ${today.toLocaleDateString()}`);
  } else if (message.includes("goodbye") || message.includes("bye")) {
    speak("Goodbye, sir. Have a great day!");
  } else if (message.includes("help")) {
    speak(
      "I can assist with tasks like opening websites, checking the time and date, playing music, and setting reminders. Just give me a command."
    );
  } else if (message.includes("weather") || message.includes("temperature")) {
    let city = message.replace("weather", "").replace("temperature", "").trim();
    if (city) {
      speak(`Fetching the weather and temperature for ${city}`);
      await fetchWeather(city); // Get weather and temperature info
    } else {
      speak("Please specify the city to check the weather or temperature.");
    }
  } else if (message.includes("open calculator")) {
    speak("Opening calculator...");
    openUrlInNewTab("https://www.google.com/search?q=calculator");
  } else if (message.includes("open whatsapp")) {
    speak("Opening WhatsApp...");
    openUrlInNewTab("https://web.whatsapp.com/");
  } else if (message.includes("search")) {
    let searchQuery = message.replace("search", "").trim();
    if (searchQuery) {
      speak(`Searching Google for ${searchQuery}`);
      openUrlInNewTab(
        `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
      );
    } else {
      speak("Please specify what you'd like to search for.");
    }
  } else if (message.includes("news")) {
    speak("Opening the latest news...");
    openUrlInNewTab("https://news.google.com/");
  } else if (message.includes("open facebook")) {
    speak("Opening Facebook...");
    openUrlInNewTab("https://www.facebook.com/");
  } else {
    // This block will run if no other commands are matched
    speak("Sorry, I didn't understand that.");
  }
}
