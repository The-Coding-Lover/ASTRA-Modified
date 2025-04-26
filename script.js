const userInput = document.getElementById("userInput");
const chatOutput = document.getElementById("chatbox");
const voiceBtn = document.getElementById("voiceBtn");
const sendBtn = document.getElementById("sendBtn");

// Utility: Random thank you reply
const thankYouReply = () => {
  const responses = [
    "You're most welcome!",
    "Happy to help!",
    "Anytime! Let me know if you need anything else.",
    "Glad I could assist you!",
    "It's my pleasure!"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Utility: Random jokes
const randomjokes = () => {
  const jokes = [
    "Why don’t scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "What do you call fake spaghetti? An impasta!",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What did one wall say to the other wall? I’ll meet you at the corner.",
    "Why can’t your nose be 12 inches long? Because then it would be a foot!",
    "Why did the math book look sad? Because it had too many problems.",
    "How do you organize a space party? You planet.",
    "Why did the coffee file a police report? It got mugged.",
    "What do you call cheese that isn’t yours? Nacho cheese.",
    "Why don’t oysters share their pearls? Because they’re shellfish.",
    "How does a penguin build its house? Igloos it together.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What did the janitor say when he jumped out of the closet? Supplies!",
    "Why did the cookie go to the hospital? Because it felt crummy.",
    "Why can’t you hear a pterodactyl go to the bathroom? Because the “P” is silent.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "What do you call a belt made of watches? A waist of time.",
    "What did one ocean say to the other ocean? Nothing, they just waved."
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
};


//Utility: Help
const helpMe = () => {
  const help = [
        "How can I assist you today?",
        "Of course! What do you need help with today?",
        "What do you need help with?",
        "I'm here to help. What can I do for you?",
        "Tell me what you need, and I'll assist you.",
        "Sure! What would you like help with?",
        "Feel free to ask me anything!",
        "How can I make your day easier?",
        "What can I do to help you right now?",
        "I'm ready to assist! What's your request?",
        "I'm at your service. What can I help you with?",
        "What can I do for you today?",
        "Tell me how I can assist you.",
        "Need help with something? Let me know!",
        "I'm here for you—what do you need help with?",
        "How can I support you today?",
        "What can I assist you with right now?",
        "Let me know how I can make things better for you!",
        "I'm ready to lend a hand. What do you need?",
        "You’ve got my attention. What do you need help with?",
        "I’m ready to solve any problem you have. What’s up?"
  ];
  return help[Math.floor(Math.random() * help.length)];
};

//Utility: Manual unit conversion
// Function to perform unit conversions
function convertUnits(value, fromUnit, toUnit) {
    // Length conversion (e.g., meters to kilometers, inches to centimeters)
    const lengthConversions = {
        "metersToKilometers": value => value / 1000,
        "kilometersToMeters": value => value * 1000,
        "inchesToCentimeters": value => value * 2.54,
        "centimetersToInches": value => value / 2.54
    };

    // Temperature conversion (Celsius to Fahrenheit, and vice versa)
    const temperatureConversions = {
        "celsiusToFahrenheit": value => (value * 9/5) + 32,
        "fahrenheitToCelsius": value => (value - 32) * 5/9
    };

    let conversionResult;

    // Handle length conversions
    if (fromUnit === "meters" && toUnit === "kilometers") {
        conversionResult = lengthConversions.metersToKilometers(value);
    } else if (fromUnit === "kilometers" && toUnit === "meters") {
        conversionResult = lengthConversions.kilometersToMeters(value);
    } else if (fromUnit === "inches" && toUnit === "centimeters") {
        conversionResult = lengthConversions.inchesToCentimeters(value);
    } else if (fromUnit === "centimeters" && toUnit === "inches") {
        conversionResult = lengthConversions.centimetersToInches(value);
    }

    // Handle temperature conversions
    if (fromUnit === "Celsius" && toUnit === "Fahrenheit") {
        conversionResult = temperatureConversions.celsiusToFahrenheit(value);
    } else if (fromUnit === "Fahrenheit" && toUnit === "Celsius") {
        conversionResult = temperatureConversions.fahrenheitToCelsius(value);
    }

    if (conversionResult !== undefined) {
        return `${value} ${fromUnit} is equal to ${conversionResult.toFixed(2)} ${toUnit}.`;
    } else {
        return "Sorry, I couldn't perform the conversion. Please check the units and try again.";
    }
}

// Function to perform currency conversions (this is a mock-up, replace with actual conversion API)
async function convertCurrency(value, fromCurrency, toCurrency) {
    // Example mock conversion rates, replace with actual API call or logic.
    const conversionRates = {
        "USD_TO_EUR": 0.85,
        "EUR_TO_USD": 1.18
    };

    const conversionKey = `${fromCurrency}_TO_${toCurrency}`;
    const rate = conversionRates[conversionKey];

    if (rate) {
        const result = value * rate;
        return `${value} ${fromCurrency} is equal to ${result.toFixed(2)} ${toCurrency}.`;
    } else {
        return "Sorry, I couldn't perform the currency conversion. Please check the currencies and try again.";
    }
}

// Function to extract conversion details from the message
function extractConversionDetails(message) {
    // Unit conversion pattern
    const unitConversionPattern = /convert (\d+\.?\d*) (\w+) to (\w+)/i;
    const currencyConversionPattern = /convert (\d+\.?\d*) (\w{3}) to (\w{3})/i;

    let match;
    
    // Try to match a unit conversion
    if ((match = message.match(unitConversionPattern))) {
        return {
            type: 'unit',
            value: parseFloat(match[1]),
            fromUnit: match[2].toLowerCase(),
            toUnit: match[3].toLowerCase()
        };
    }
    // Try to match a currency conversion
    else if ((match = message.match(currencyConversionPattern))) {
        return {
            type: 'currency',
            value: parseFloat(match[1]),
            fromUnit: match[2].toUpperCase(),
            toUnit: match[3].toUpperCase()
        };
    }

    return null;  // If no match, return null
}

// Function to perform the conversion based on type (currency or unit)
async function performConversion(type, value, fromUnit, toUnit) {
    if (type === 'currency') {
        // Call the currency conversion function
        return await convertCurrency(value, fromUnit, toUnit);
    } else if (type === 'unit') {
        // Call the unit conversion function
        return convertUnits(value, fromUnit, toUnit);
    } else {
        return "Invalid conversion type. Please specify either 'currency' or 'unit'.";
    }
}


// Utility: Speak text
const speakMessage = (message) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.voice = synth.getVoices()[0]; // You can customize the voice
  utterance.rate = 1;
  utterance.volume = 1;
  utterance.pitch = 1;
  synth.speak(utterance);
};

// Add user/bot message to chat window
function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatOutput.appendChild(msg);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Astra typing animation
function typeMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message bot";
  chatOutput.appendChild(msg);

  let i = 0;
  const typing = setInterval(() => {
    msg.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typing);
      speakMessage(text);
    }
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }, 30);
}

// Greet user on load
function wishMe() {
  const hour = new Date().getHours();
  if (hour < 12) speakMessage("Good Morning Sir...");
  else if (hour < 17) speakMessage("Good Afternoon Sir...");
  else speakMessage("Good Evening Sir...");
}

window.addEventListener("load", () => {
  speakMessage("Initializing Astra...");
  wishMe();
});

// Voice input setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[event.resultIndex][0].transcript;
  addMessage(transcript, "user");
  takeCommand(transcript.toLowerCase());
};

voiceBtn.addEventListener("click", () => {
  recognition.start();
});

// Send button and Enter key input
sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});

// Handle typed input
function handleUserInput() {
  const input = userInput.value.trim();
  if (input === "") return;
  addMessage(input, "user");
  userInput.value = "";
  takeCommand(input.toLowerCase());
}

// Command logic
function takeCommand(message) {
  if (message.includes("hello") || message.includes("hey")) {
    typeMessage("Hello Sir, how can I help you?");
  } else if (message.includes("time")) {
    const time = new Date().toLocaleTimeString();
    typeMessage("The current time is " + time);
  } else if (message.includes("date")) {
    const date = new Date().toLocaleDateString();
    typeMessage("Today's date is " + date);
  } else if (message.includes("your name")) {
    typeMessage("My name is Astra, your virtual assistant.");
  } else if (message.includes("who am i")) {
    typeMessage("You are my Malik");
  } else if (
    message.includes("thank you") ||
    message.includes("thanks") ||
    message.includes("thankyou") ||
    message.includes("thank you so much")
  ) {
    const reply = thankYouReply();
    typeMessage(reply);
  }  else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    typeMessage("Opening Youtube...");
  } else if (message.includes("open whatsapp")) {
    window.open("https://whatsapp.com", "_blank");
    typeMessage("Opening Whatsapp...");
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    typeMessage("Opening Facebook...");
  } else if (message.includes("open instagram")) {
    window.open("https://instagram.com", "_blank");
    typeMessage("Opening Instagram...");
  } else if (message.includes("open spotify")) {
    window.open("https://spotify.com", "_blank");
    typeMessage("Opening Spotify...");
  } else if (message.includes("open play store")) {
    window.open("https://play.google.com", "_blank");
    typeMessage("Opening Playstore...");
  } else if (message.includes("dark mode")) {
    document.body.classList.add("dark-mode");
    typeMessage("Dark mode activated.");
  } else if (message.includes("light mode")) {
    document.body.classList.remove("dark-mode");
    typeMessage("Light mode activated.");
  } else if (
    message.includes("calculate")
  ) {
    processInput(message);
  } else if (message.includes("convert")) {
    // First, check if the message provides all the necessary details, 
    // if not, ask for more details.
    const conversionDetails = extractConversionDetails(message); // Function to extract details

    if (conversionDetails) {
        const { type, value, fromUnit, toUnit } = conversionDetails;
        
        // Call the performConversion function
        performConversion(type, value, fromUnit, toUnit)
            .then(response => {
                typeMessage(response); // Send the response to the chatbot
            })
            .catch(error => {
                typeMessage("Sorry, there was an error with the conversion.");
            });
    } else {
        // If the necessary details are not found, prompt the user for more information
        typeMessage("Please provide the conversion details in the following format: 'convert 100 meters to kilometers' or 'convert 50 USD to EUR'.");
} else {
    typeMessage("Sorry, I couldn't understand that. Please try something else.");
  }
}


// Function to calculate the mathematical expression
function calculate(expression) {
  expression = expression.replace(/\s+/g, ''); // Remove spaces

  const regex = /(\d+(\.\d+)?|[-+*/()])/g;
  const tokens = expression.match(regex);

  // Helper function to evaluate the expression
  function parseTokens(tokens) {
    let numStack = [];
    let opStack = [];

    // Helper to apply operator
    function applyOperator() {
      const operator = opStack.pop();
      const b = numStack.pop();
      const a = numStack.pop();
      switch (operator) {
        case '+':
          numStack.push(a + b);
          break;
        case '-':
          numStack.push(a - b);
          break;
        case '*':
          numStack.push(a * b);
          break;
        case '/':
          numStack.push(a / b);
          break;
        default:
          break;
      }
    }

    // Process tokens
    for (let token of tokens) {
      if (/\d/.test(token)) { // It's a number
        numStack.push(parseFloat(token));
      } else if (token === '(') {
        opStack.push(token); // Push open parenthesis
      } else if (token === ')') {
        while (opStack[opStack.length - 1] !== '(') {
          applyOperator();
        }
        opStack.pop(); // Remove '('
      } else { // It's an operator
        while (opStack.length && getPrecedence(opStack[opStack.length - 1]) >= getPrecedence(token)) {
          applyOperator();
        }
        opStack.push(token);
      }
    }

    // Apply remaining operators
    while (opStack.length) {
      applyOperator();
    }

    return numStack[0];
  }

  // Function to get operator precedence
  function getPrecedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
  }

  return parseTokens(tokens);
}

// Example of condition where the calculation function is called
function processInput(input) {
  if (input === "quit") {
    typeMessage("Exiting...");
  } else if (input.startsWith("calculate")) {
    const expression = input.slice(10).trim(); // Extract the expression after 'calculate:'
    const result = calculate(expression); // Call the calculate function
    typeMessage(`The Result is : ${result}`);
  } else {
    typeMessage("Invalid command.");
  }
}
