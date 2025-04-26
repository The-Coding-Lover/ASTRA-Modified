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
    // message.includes("calculator") ||
    // message.includes("plus") ||
    // message.includes("minus") ||
    // message.includes("divide") ||
    // message.includes("multiply")
    message.includes("calculate")
  ) {
    processInput(message);
  } else {
    typeMessage("Sorry, I couldn't understand that. Please try something else.");
  }
}

// Simple calculator
// function calculate(msg) {
//   try {
//     const expression = msg
//       .replace(/plus/g, "+")
//       .replace(/minus/g, "-")
//       .replace(/into|multiply|times/g, "*")
//       .replace(/divide|by/g, "/");
//     const result = eval(expression);
//     typeMessage(`The result is ${result}`);
//   } catch {
//     typeMessage("Sorry, I couldn't calculate that.");
//   }
// }



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

// Example usage
// processInput("calculate: 2 + 3 * (4 - 1)");  // Will call calculate function
// processInput("quit");  // Will exit
// processInput("random command");  // Will print "Invalid command."
