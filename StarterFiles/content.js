// API Key (Replace with your actual key)
const apiKey = "AIzaSyAHELNvsN752xoE-DoXnd8pII3B8xK0_fw";
const apiUrl =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;


// Function to Call Gemini API
async function callGeminiAPI(prompt) {
  const restrictedPrompt = `
  You are an AI email assistant. Your main role is to assist users with email-related tasks such as composing, replying, summarizing, translating, and improving emails.
  
  You can also answer basic general chat questions, such as greetings and small talk.
  However, if a question is completely unrelated to emails or basic chat, respond with:
  "I'm here to assist you with emails and simple conversations. Let me know how I can help!"
  
  Please provide your response in plain text, without any special characters like *, **, or markdown formatting.
  
  User Query: ${prompt}
  `;
  

try {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: restrictedPrompt }] }] })
  });

  const data = await response.json();
  if (data.candidates && data.candidates[0].content.parts[0].text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    return "No response from AI.";
  }
} catch (error) {
  console.error("API Error:", error);
  return "Error contacting AI service.";
}
}


// Insert AI Assist Button Near Compose Button// Function to Insert AI Assist Button Near Compose Button
function insertAIButton() {
  const composeButton = document.querySelector('div[gh="cm"]');

  if (composeButton && !document.getElementById("ai-assist-btn")) {
    // Create AI Assist button
    const aiButton = document.createElement("div");
    const imgSrc = chrome.runtime.getURL("bot.png"); // Get the image path dynamically
    aiButton.id = "ai-assist-btn";
    aiButton.style.cursor = "pointer";
    aiButton.style.marginLeft = "10px";
    aiButton.style.width = "90px";
    aiButton.style.height = "36px";
    aiButton.style.padding = "5px 10px"; 
    aiButton.style.fontSize = "14px";
    aiButton.style.borderRadius = "8px";
    aiButton.style.border = "1px solid #ddd";
    aiButton.style.background = "#C2E7FF";
    aiButton.style.display = "inline-flex";
    aiButton.style.alignItems = "center";
    aiButton.style.justifyContent = "center";
    aiButton.style.position = "relative";
    aiButton.style.gap = "6px"; // Space between text and icon

    // Set inner HTML for the button (image + text)
    aiButton.innerHTML = `
      <img src="${imgSrc}" width="20" height="20" alt="AI Bot">
      <span style="font-weight: bold; color: #000;">AI</span>
    `;

    // Onclick - Show chatbot
    aiButton.onclick = () => {
      if (!document.getElementById("chatbot-container")) {
        createChatbotUI();
      }
    };

    composeButton.parentNode.insertBefore(aiButton, composeButton.nextSibling);
  }
}


function createChatbotUI() {
  const chatbotContainer = document.createElement("div");
  chatbotContainer.id = "chatbot-container";
  
  chatbotContainer.innerHTML = `
    <div id="chatbot-header">
      <span>AI Chatbot</span>
      <div>
        <button id="maximize-chatbot">🗖</button>
        <button id="close-chatbot">✖</button>
      </div>
    </div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input-area">
      <input id="chatbot-input" type="text" placeholder="Type your message..." />
      <button id="send-message">Send</button>
      <button id="clear-chat">Clear Chat</button>
    </div>
  `;
  
  document.body.appendChild(chatbotContainer);
  
  // Add CSS styles
  const style = document.createElement("style");
  style.textContent = `
    #chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 500px;
      background-color: #fff;
      border: 1px solid #dadce0;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: Arial, sans-serif;
      resize: both;
      overflow: auto;
      z-index: 999999 !important;
    }

    #chatbot-header {
      background-color: #f1f3f4;
      color: #202124;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      border-bottom: 1px solid #dadce0;
      cursor: move;
    }

    #chatbot-header button {
      background: none;
      border: none;
      color: #5f6368;
      font-size: 16px;
      cursor: pointer;
      margin-left: 5px;
    }

    #chatbot-messages {
      flex-grow: 1;
      padding: 12px;
      overflow-y: auto;
      background-color: #fff;
      scrollbar-width: thin;
      scrollbar-color: #c0c4c9 transparent;
    }

    #chatbot-input-area {
      display: flex;
      border-top: 1px solid #dadce0;
      padding: 8px;
      background: #fff;
    }

    #chatbot-input {
      flex-grow: 1;
      border: none;
      padding: 12px;
      font-size: 14px;
      outline: none;
      color: #202124;
      background:rgba(26, 115, 232, 0.15);
      transition: background 0.2s;
      border-radius: 12px 0px 0px 12px;
    }

    #send-message{
      border: none;
      padding: 12px 16px;
      cursor: pointer;
      font-weight: bold;
      border-radius: 0px 12px 12px 0px;
      transition: background 0.2s;
    }
     #clear-chat {
      border: none;
      padding: 12px 16px;
      cursor: pointer;
      font-weight: bold;
      border-radius: 12px;
      margin-left: 10px;
      transition: background 0.2s;
    }

    #chatbot-messages div {
      margin-bottom: 12px;
      padding: 10px;
      border-radius: 8px;
      max-width: 80%;
    }
    
    #chatbot-messages div.ai {
      background-color: #f1f3f4;
      align-self: flex-start;
    }

    #chatbot-messages div.you {
      background-color: #e8f0fe;
      align-self: flex-end;
    }

    #send-message { background-color: #1a73e8; color: white; }
    #send-message:hover { background-color: #165fc1; }
    #clear-chat { background-color: #f44336; color: white; }
  `;
  document.head.appendChild(style);

  // Close button
  chatbotContainer.querySelector("#close-chatbot").onclick = () => chatbotContainer.remove();

  // Maximize button
  chatbotContainer.querySelector("#maximize-chatbot").onclick = () => {
    if (chatbotContainer.style.width === "100%" && chatbotContainer.style.height === "100%") {
      chatbotContainer.style.width = "400px";
      chatbotContainer.style.height = "500px";
    } else {
      chatbotContainer.style.width = "100%";
      chatbotContainer.style.height = "100%";
    }
  };

  // Send message
  const chatbotInput = chatbotContainer.querySelector("#chatbot-input");
  const sendMessageButton = chatbotContainer.querySelector("#send-message");
  const clearChatButton = chatbotContainer.querySelector("#clear-chat");
  chatbotInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents adding a new line
      sendMessageButton.click(); // Triggers the Send button
    }
  });

  //send message
  sendMessageButton.onclick = async () => {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
      appendMessage("You", userMessage, "you");
      saveMessage("You", userMessage);
      chatbotInput.value = "";

      const aiResponse = await callGeminiAPI(userMessage);
      appendMessage("AI", aiResponse, "ai");
      saveMessage("AI", aiResponse);
    }
  };
  clearChatButton.onclick = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      localStorage.removeItem("chatbotMessages");
      document.getElementById("chatbot-messages").innerHTML = "";
    }
  };

  loadMessages();

  // Dragging functionality
  let isDragging = false, startX, startY, startLeft, startTop;
  chatbotContainer.querySelector("#chatbot-header").onmousedown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = chatbotContainer.offsetLeft;
    startTop = chatbotContainer.offsetTop;
    document.onmousemove = (e) => {
      if (isDragging) {
        chatbotContainer.style.left = startLeft + e.clientX - startX + "px";
        chatbotContainer.style.top = startTop + e.clientY - startY + "px";
      }
    };
    document.onmouseup = () => { isDragging = false; document.onmousemove = null; };
  };
}


function appendMessage(sender, message, type) {
  const chatbotMessages = document.getElementById("chatbot-messages");
  
  const messageContainer = document.createElement("div");
  messageContainer.classList.add(type);
  
  const messageDiv = document.createElement("span");
  messageDiv.textContent = `${sender}: ${message}`;
  
  const speakButton = document.createElement("button");
  speakButton.textContent = "🔊";
  speakButton.onclick = () => speakText(message);

  messageContainer.appendChild(messageDiv);
  if (sender === "AI") {
    messageContainer.appendChild(speakButton);
  }
  chatbotMessages.appendChild(messageContainer);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
function speakText(text, lang = 'en-US') {
  if (!('speechSynthesis' in window)) {
    console.error("Text-to-Speech is not supported in this browser.");
    return;
  }
  
  // Stop speech if it's already speaking
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    console.log("Speech stopped.");
    return;
  }

  // Create and speak the text
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

// Save messages to local storage
function saveMessage(sender, message) {
  const chats = JSON.parse(localStorage.getItem("chatbotMessages") || "[]");
  chats.push({ sender, message });
  localStorage.setItem("chatbotMessages", JSON.stringify(chats));
}

// Load messages from local storage
function loadMessages() {
  const chats = JSON.parse(localStorage.getItem("chatbotMessages") || "[]");
  chats.forEach(chat => {
    const type = chat.sender === "You" ? "you" : "ai";
    appendMessage(chat.sender, chat.message, type);
  });
}

setInterval(insertAIButton, 3000);
// Function to Insert Translator Button Inside an Opened Email
function insertTranslateButton() {
    const emailHeader = document.querySelector('div[role="main"] h2'); // Gmail email subject/header
    if (emailHeader && !document.getElementById("translate-email-btn")) {
        const translateButton = document.createElement("button");
        translateButton.id = "translate-email-btn";
        translateButton.innerText = "Translate";
        translateButton.style.cursor = "pointer";
        translateButton.style.marginLeft = "10px";
        translateButton.style.padding = "5px 10px";
        translateButton.style.backgroundColor = "#1a73e8";
        translateButton.style.color = "#fff";
        translateButton.style.border = "none";
        translateButton.style.borderRadius = "5px";
        translateButton.style.fontSize = "14px";

        // Onclick - Translate the Email Content
        translateButton.onclick = handleEmailTranslation;

        emailHeader.parentNode.insertBefore(translateButton, emailHeader.nextSibling);
    }
}

// Function to Handle Email Translation
async function handleEmailTranslation() {
    const emailBody = document.querySelector('div[role="main"] .ii.gt'); // Gmail email body
    if (!emailBody) {
        alert("No email content found to translate.");
        return;
    }

    const textToTranslate = emailBody.innerText.trim();
    if (!textToTranslate) {
        alert("Email content is empty.");
        return;
    }

    const targetLanguage = "es"; // Change to your preferred language (e.g., 'fr' for French)
    const translatedText = await callTranslationAPI(textToTranslate, targetLanguage);

    showTranslationPopup(translatedText);
}

// Function to Call Gemini API for Translation
async function callTranslationAPI(text, targetLanguage) {
    const prompt =`Translate the following text to ${targetLanguage}: "${text}"`;
    return await callGeminiAPI(prompt);
}

// Function to Show Translation in a Popup
function showTranslationPopup(translatedText) {
    const popup = document.createElement("div");
    popup.id = "translation-popup";
    popup.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        ">
            <h4>Translated Email</h4>
            <p style="font-size: 14px;">${translatedText}</p>
            <button id="close-popup" style="
                background-color: #f44336;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 5px;
                margin-top: 10px;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    document.getElementById("close-popup").onclick = () => popup.remove();
}

// Run Every 3 Seconds to Insert the Button When an Email is Opened
setInterval(insertTranslateButton, 3000);


function insertTranslateButton() {
    const emailHeader = document.querySelector('h2[data-legacy-thread-id]');
    
    if (emailHeader && !document.getElementById("translate-email-btn")) {
        // Create Translate Button
        const translateButton = document.createElement("button");
        translateButton.id = "translate-email-btn";
        translateButton.innerText = "Translate";
        translateButton.style.cursor = "pointer";
        translateButton.style.padding = "6px 12px";
        translateButton.style.backgroundColor = "#CBE8FF";
        translateButton.style.color = "#000000";
        translateButton.style.border = "none";
        translateButton.style.borderRadius = "5px";
        translateButton.style.fontSize = "14px";
        translateButton.style.marginLeft = "10px";

        // Attach click event to show dropdown
        translateButton.onclick = () => {
            showLanguageDropdown(translateButton);
        };

        emailHeader.parentNode.insertBefore(translateButton, emailHeader.nextSibling);
    }
}
// Function to Show Language Dropdown
function showLanguageDropdown(button) {
  const existingContainer = document.getElementById("dropdown-container");
  if (existingContainer) {
      existingContainer.remove(); // Remove entire container if it exists
      return;
  }

  // Create Dropdown
  const languageDropdown = document.createElement("select");
  languageDropdown.id = "language-dropdown";
  languageDropdown.style.padding = "6px";
  languageDropdown.style.border = "1px solid #ccc";
  languageDropdown.style.borderRadius = "5px";
  languageDropdown.style.fontSize = "14px";
  languageDropdown.style.marginLeft = "10px";

  // Language Options
  const languages = {
    en: "English",
    sq: "Albanian",
    af: "Afrikaans",
    am: "Amharic",
    ar: "Arabic",
    hy: "Armenian",
    az: "Azerbaijani",
    ay: "Aymara",
    eu: "Basque",
    bn: "Bengali",
    bs: "Bosnian",
    bg: "Bulgarian",
    my: "Burmese",
    ca: "Catalan",
    zh: "Chinese",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    dz: "Dzongkha",
    eo: "Esperanto",
    et: "Estonian",
    fi: "Finnish",
    fr: "French",
    gl: "Galician",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    gu: "Gujarati",
    ha: "Hausa",
    he: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    is: "Icelandic",
    id: "Indonesian",
    ig: "Igbo",
    ga: "Irish",
    it: "Italian",
    ja: "Japanese",
    kn: "Kannada",
    kk: "Kazakh",
    km: "Khmer",
    ko: "Korean",
    ky: "Kyrgyz",
    lo: "Lao",
    lv: "Latvian",
    lt: "Lithuanian",
    mg: "Malagasy",
    ms: "Malay",
    ml: "Malayalam",
    mt: "Maltese",
    mk: "Macedonian",
    mn: "Mongolian",
    mr: "Marathi",
    ne: "Nepali",
    no: "Norwegian",
    or: "Odia",
    pa: "Punjabi",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese",
    qu: "Quechua",
    ro: "Romanian",
    ru: "Russian",
    sr: "Serbian",
    si: "Sinhala",
    sk: "Slovak",
    sl: "Slovenian",
    st: "Sesotho",
    es: "Spanish",
    sw: "Swahili",
    sv: "Swedish",
    ta: "Tamil",
    te: "Telugu",
    th: "Thai",
    ti: "Tigrinya",
    tl: "Tagalog",
    tg: "Tajik",
    tk: "Turkmen",
    tr: "Turkish",
    tt: "Tatar",
    ug: "Uyghur",
    uk: "Ukrainian",
    ur: "Urdu",
    uz: "Uzbek",
    vi: "Vietnamese",
    cy: "Welsh",
    xh: "Xhosa",
    sah: "Yakut",
    yo: "Yoruba",
    zu: "Zulu"
};


  for (const [code, name] of Object.entries(languages)) {
      const option = document.createElement("option");
      option.value = code;
      option.innerText = name;
      languageDropdown.appendChild(option);
  }

  // Create Confirm Button
  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Translate Now";
  confirmButton.style.cursor = "pointer";
  confirmButton.style.padding = "6px 12px";
  confirmButton.style.backgroundColor = "#34a853";
  confirmButton.style.color = "#fff";
  confirmButton.style.border = "none";
  confirmButton.style.borderRadius = "5px";
  confirmButton.style.fontSize = "14px";
  confirmButton.style.marginLeft = "5px";

  confirmButton.onclick = () => {
      const selectedLanguage = languageDropdown.value;
      translateEmailContent(selectedLanguage);
      toggleButton.style.display = "inline-block"; // Show "Show Original" after translation
  };

  // Create Toggle Back Button
  const toggleButton = document.createElement("button");
  toggleButton.innerText = "Show Original";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.padding = "6px 12px";
  toggleButton.style.backgroundColor = "#fbbc05";
  toggleButton.style.color = "#000";
  toggleButton.style.border = "none";
  toggleButton.style.borderRadius = "5px";
  toggleButton.style.fontSize = "14px";
  toggleButton.style.marginLeft = "5px";
  toggleButton.style.display = "none";

  toggleButton.onclick = () => {
      showOriginalEmail();
      toggleButton.style.display = "none"; // Hide again after showing original
  };

  // Create Container
  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = "dropdown-container";
  dropdownContainer.style.display = "inline-flex";
  dropdownContainer.style.alignItems = "center";
  dropdownContainer.style.marginLeft = "10px";

  dropdownContainer.appendChild(languageDropdown);
  dropdownContainer.appendChild(confirmButton);
  dropdownContainer.appendChild(toggleButton);

  button.parentNode.insertBefore(dropdownContainer, button.nextSibling);
}


// Function to Translate Email Content
async function translateEmailContent(targetLanguage) {
    const emailBody = document.querySelector('div[role="main"] .ii.gt');
    if (!emailBody) {
        alert("No email content found to translate.");
        return;
    }

    // Store Original HTML Before Translating
    if (!emailBody.dataset.originalHTML) {
        emailBody.dataset.originalHTML = emailBody.innerHTML;
    }

    // Extract Text Content Without Extra AI Formatting
    const originalText = emailBody.innerText.trim();
    if (!originalText) {
        alert("Email content is empty.");
        return;
    }

    // Detect Original Language
    const detectedLanguage = await detectLanguage(originalText);

    // Call API for Translation
    const translatedText = await callTranslationAPI(originalText, targetLanguage);

    // Replace email content with translated text inside an editable div
    emailBody.innerHTML = `<div contenteditable="true" style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
        <strong>Original Language: ${detectedLanguage.toUpperCase()}</strong><br><br>${translatedText}
    </div>`;

    // Show "Show Original" Button
    document.querySelector("#dropdown-container button:nth-child(3)").style.display = "inline-block";
}

// Function to Show the Original Email
function showOriginalEmail() {
    const emailBody = document.querySelector('div[role="main"] .ii.gt');
    if (emailBody && emailBody.dataset.originalHTML) {
        emailBody.innerHTML = emailBody.dataset.originalHTML;
    }
}

// Function to Call Google Translate API Directly (More Accurate)
async function callTranslationAPI(text, targetLanguage) {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0].map(item => item[0]).join(" ");
}

// Function to Detect Original Language
async function detectLanguage(text) {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[2]; // Returns detected language code (e.g., "es" for Spanish)
}

// Run Function to Detect Emails Opening
setInterval(insertTranslateButton, 3000);

// Function to add the "Reply Now" button inside the reply box
function addGenerateReplyButton() {
  let replyBox = document.querySelector(".editable"); // Find the reply box

  if (replyBox && !document.getElementById("generate-reply-button")) {
      let button = document.createElement("button");
      button.innerText = "Generate Reply";
      button.id = "generate-reply-button";
      button.style.background = "#CBE8FF";
      button.style.color = "#000000";
      button.style.border = "none";
      button.style.padding = "8px 12px";
      button.style.marginTop = "10px";
      button.style.cursor = "pointer";
      button.style.borderRadius = "4px";

      button.addEventListener("click", async function () {
          let userInput = prompt("What should the reply say?");
          if (userInput) {
              let success = await generateReply(replyBox, userInput);
              if (success) {
                  alert("Reply generated successfully!");
              } else {
                  alert("Failed to generate reply.");
              }
          }
      });

      replyBox.parentNode.appendChild(button);
  }
}

// Watch for reply boxes opening
setInterval(addGenerateReplyButton, 2000);

async function generateReply(replyBox, userInput) {
  let emailBodies = document.querySelectorAll(".a3s.aiL"); // Find latest email content
  if (emailBodies.length === 0) {
      alert("No email content found.");
      return false;
  }

  let latestEmail = emailBodies[emailBodies.length - 1].innerText; // Get latest email content

  let replyText = await generateSmartReply(latestEmail, userInput);

  if (replyText) {
      replyBox.innerHTML = formatEmailReply(replyText);
      return true;
  } else {
      return false;
  }
}
async function generateSmartReply(emailText, userInput) {
  try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              contents: [
                  { role: "user", parts: [{ text: `
Please generate a polite and professional email reply based on the following email. 

- Structure the reply with a clear subject.
- Use simple and formal language.
- Format the email using clear paragraphs and headings without including any unnecessary symbols like asterisks or code blocks.
- End the email with a closing statement like "Best regards" and a placeholder for the sender's name.

Here is the email to reply to:
"${emailText}"

Additional User Input (if any):
"${userInput}"
                  ` }] }
              ]
          })
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          return `Error: ${errorData.error?.message || "Failed to generate reply."}`;
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.candidates && data.candidates.length > 0) {
          return data.candidates[0].content.parts[0].text;
      } else {
          console.error("No reply generated:", data);
          return "Sorry, I couldn't generate a response. Please try again.";
      }
  } catch (error) {
      console.error("Error generating reply:", error);
      return "Error generating reply. Please try again.";
  }
}


function formatEmailReply(replyText) {
  return `<p>Dear Sender,</p>
          <p>${replyText}</p>
          <p>Best regards,</p>
          <p>[Your Name]</p>`;
}