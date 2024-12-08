// GSAP Animations
gsap.from(".app-header h1", { opacity: 0, y: -50, duration: 1 });
gsap.from(".app-header p", { opacity: 0, y: 20, duration: 1, delay: 0.5 });
gsap.from(".card", { opacity: 0, scale: 0.8, duration: 1, delay: 1 });
gsap.from(".app-footer", { opacity: 0, y: 50, duration: 1, delay: 1.5 });

// DOM Elements
const textInput = document.getElementById("textInput");
const translateBtn = document.getElementById("translateBtn");
const speakBtn = document.getElementById("speakBtn");
const detectBtn = document.getElementById("detectBtn");
const speakOutputBtn = document.getElementById("speakOutputBtn");
const languageSelect = document.getElementById("languageSelect");
const outputContainer = document.getElementById("outputContainer");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const historyList = document.getElementById("historyList");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Copy Translated Text
copyBtn.addEventListener("click", () => {
  const text = outputText.textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
});

// Share Translated Text
shareBtn.addEventListener("click", () => {
  const text = outputText.textContent;
  if (navigator.share) {
    navigator.share({ text }).catch((error) => console.error("Sharing failed", error));
  } else {
    alert("Sharing is not supported in this browser.");
  }
});

// Save Translation History
function saveToHistory(text, translation) {
  const li = document.createElement("li");
  li.textContent = `Input: ${text} → Translation: ${translation}`;
  historyList.appendChild(li);
  historyList.parentElement.style.display = "block";
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});


// Supported Languages
const languages = {
    "af": "Afrikaans",
    "am": "Amharic",
    "ar": "Arabic",
    "az": "Azerbaijani",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "en": "English",
    "eo": "Esperanto",
    "es": "Spanish",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "ga": "Irish",
    "gd": "Scots Gaelic",
    "gl": "Galician",
    "gu": "Gujarati",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hr": "Croatian",
    "ht": "Haitian Creole",
    "hu": "Hungarian",
    "hy": "Armenian",
    "id": "Indonesian",
    "ig": "Igbo",
    "is": "Icelandic",
    "it": "Italian",
    "iw": "Hebrew",
    "ja": "Japanese",
    "jw": "Javanese",
    "ka": "Georgian",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "la": "Latin",
    "lb": "Luxembourgish",
    "lo": "Lao",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mg": "Malagasy",
    "mi": "Maori",
    "mk": "Macedonian",
    "ml": "Malayalam",
    "mn": "Mongolian",
    "mr": "Marathi",
    "ms": "Malay",
    "mt": "Maltese",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "ny": "Chichewa",
    "or": "Odia (Oriya)",
    "pa": "Punjabi",
    "pl": "Polish",
    "ps": "Pashto",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sm": "Samoan",
    "sn": "Shona",
    "so": "Somali",
    "sq": "Albanian",
    "sr": "Serbian",
    "st": "Sesotho",
    "su": "Sundanese",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tg": "Tajik",
    "th": "Thai",
    "tl": "Filipino",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "zu": "Zulu"
};

// Supported languages for Text-to-Speech
const supportedTTSLanguages = [
    "en", "es", "fr", "de", "it", "pt", "zh-CN", "zh-TW", "ja", "ko", "hi", "ar", "ru", "pl"
];

// Populate Language Dropdown
Object.entries(languages).forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    languageSelect.appendChild(option);
});

// Translate Functionality
translateBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    const targetLang = languageSelect.value;

    if (!text) {
        alert("Please enter text to translate!");
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
        const data = await response.json();
        if (data.responseData.translatedText) {
            outputText.textContent = data.responseData.translatedText;
            outputContainer.style.display = "block";
            gsap.from("#outputContainer", { opacity: 0, y: 20, duration: 0.5 });
        } else {
            alert("Translation failed. Try again later.");
        }
    } catch (error) {
        alert("An error occurred during translation.");
        console.error(error);
    }
});

// Speech-to-Text Functionality
speakBtn.addEventListener("click", () => {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        textInput.value = event.results[0][0].transcript;
    };

    recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
    };

    recognition.start();
});

// Text-to-Speech Functionality
speakOutputBtn.addEventListener("click", () => {
    const text = outputText.textContent;

    if (!text) {
        alert("There is no text to read.");
        return;
    }

    const lang = languageSelect.value;

    if (!supportedTTSLanguages.includes(lang)) {
        alert("Text-to-speech is not supported for this language.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    window.speechSynthesis.speak(speech);
});

// Detect Language Functionality
detectBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();

    if (!text) {
        alert("Please enter text to detect the language.");
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
        const data = await response.json();
        const detectedLang = data.responseData.language || "Unknown";

        alert(`Detected Language: ${languages[detectedLang] || detectedLang}`);
    } catch (error) {
        alert("An error occurred while detecting the language.");
        console.error(error);
    }
});
