'use client';

import { useState, useRef, useEffect } from 'react';

const OWNER_PHONE = "916350626582";

export default function AiChatbot({
  products = [],
  onOpenTryOn = null,
  onOpenCalculator = null,
  onOpenRestock = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! 🙏 I am your Kamakhya AI Wholesale Assistant. I speak both English and हिंदी! Ask me about wholesale prices, MOQs, fabric quality, or try speaking using the microphone 🎙️.',
      lang: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Stop speech when closing
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is supported in Chrome, Edge, and Android browsers.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Supports both Hindi and English accents
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech (Voice Output)
  const speakText = (text) => {
    if (!isSpeakingEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    // Prefer Indian English / Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India'));
    if (indVoice) utterance.voice = indVoice;
    window.speechSynthesis.speak(utterance);
  };

  // AI Knowledge Engine & Natural Language Processor
  const processQuery = (rawQuery) => {
    const q = rawQuery.toLowerCase().trim();
    const isHindi = /(namaste|kya|hai|batao|chahiye|kitna|rate|bhejo|sasta|kaunsa|milega|mujhe|lehenga|kurti|saree|frock)/i.test(q);

    // 1. Price extraction (e.g. "under 600", "below 1000", "500 ke andar")
    let maxPrice = Infinity;
    const priceMatch = q.match(/(?:under|below|<|andar|tak|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    // 2. Category intent
    let matchedCategory = null;
    if (/ethnic|kurti|anarkali|sharara|saree|bandhani|chanderi/i.test(q)) matchedCategory = "Ethnic Wear";
    else if (/bridal|wedding|velvet|choli/i.test(q)) matchedCategory = "Bridal";
    else if (/western|cargo|blazer|tshirt|tee|skirt|midi/i.test(q)) matchedCategory = "Western Wear";
    else if (/party|frock|girl|kid|dhoti/i.test(q)) matchedCategory = "Girls Partywear";
    else if (/lounge|kaftan|nightsuit/i.test(q)) matchedCategory = "Loungewear";

    // 3. Questions about MOQ or Factory
    if (/moq|minimum|kitne piece|how many/i.test(q)) {
      if (isHindi) {
        return {
          text: "Kamakhya Trading Co me wholesale lots ka standard MOQ 25 se 30 pieces hota hai. Agar aap fabric sample check karna chahte hain, toh aap Retail Mode toggle karke 1 single sample piece bhi mangwa sakte hain!",
          action: 'wholesale_info'
        };
      }
      return {
        text: "Our standard factory wholesale MOQ is 25–30 pieces per design lot. For quality inspection, you can toggle Retail Mode to order single sample pieces before placing bulk lots!",
        action: 'wholesale_info'
      };
    }

    // 4. Questions about profit / margin / calculator
    if (/profit|margin|kamai|calculator|roi/i.test(q)) {
      if (isHindi) {
        return {
          text: "Boutique aur shopkeeper hamare mill rates par 60% se 140% tak retail margin kamate hain! Aap hamare Margin Estimator tool se apna exact profit calculate kar sakte hain.",
          action: 'open_calculator'
        };
      }
      return {
        text: "Boutique owners earn between 60% to 140% resale margin on our direct mill rates! You can use our Margin Estimator to simulate your revenue and net profit.",
        action: 'open_calculator'
      };
    }

    // 5. Try-On questions
    if (/tryon|try on|model|pehan|fitting|look/i.test(q)) {
      if (isHindi) {
        return {
          text: "Aap hamare AI Virtual Try-On Studio me koi bhi dress 5 Indian models par ya apni custom photo upload karke dekh sakte hain! Zero photoshoot cost.",
          action: 'open_tryon'
        };
      }
      return {
        text: "You can drape any catalog item on 5 Indian & Western model archetypes or upload your own client photo in our AI Virtual Try-On Studio!",
        action: 'open_tryon'
      };
    }

    // 6. Restock / Owner Contact
    if (/contact|owner|number|phone|restock|hariom/i.test(q)) {
      if (isHindi) {
        return {
          text: `Aap direct factory owner se WhatsApp ya call par baat kar sakte hain: +91 63506 26582. Ya fir 'Request Restock' form bhar sakte hain!`,
          action: 'open_restock'
        };
      }
      return {
        text: `You can reach factory owner Hariom Joshi directly at +91 63506 26582 on WhatsApp, or submit a fast restock booking request!`,
        action: 'open_restock'
      };
    }

    // 7. Product search matching
    const matchingProducts = products.filter(p => {
      const matchCat = !matchedCategory || p.category === matchedCategory;
      const matchP = Number(p.wholesale_price || 0) <= maxPrice;
      const matchKW = q.split(/\s+/).some(word => 
        (p.title || '').toLowerCase().includes(word) || 
        (p.fabric || '').toLowerCase().includes(word)
      );
      return matchCat && matchP && (matchedCategory || matchKW);
    }).slice(0, 3);

    if (matchingProducts.length > 0) {
      const prodList = matchingProducts.map(p => `• *${p.title}* (₹${p.wholesale_price}/pc, MOQ: ${p.moq || 30})`).join('\n');
      if (isHindi) {
        return {
          text: `Aapki pasand ke hisab se ye top wholesale designs ready hain:\n\n${prodList}\n\nAap inko AI Studio me try kar sakte hain ya WhatsApp par order kar sakte hain!`,
          recommended: matchingProducts
        };
      }
      return {
        text: `Here are top factory lots matching your query:\n\n${prodList}\n\nYou can visualize them in AI Try-On Studio or send a WhatsApp quotation!`,
        recommended: matchingProducts
      };
    }

    // Default Fallback
    if (isHindi) {
      return {
        text: "Namaste! Kamakhya Trading Co me Kurtis, Lehengas, Sarees, Western Tops aur Girls Frocks direct factory mill rate par uplabdh hain. Aap kisi bhi item ka rate puch sakte hain ya WhatsApp par sampark kar sakte hain (+91 63506 26582).",
        action: 'general'
      };
    }

    return {
      text: "Welcome to Kamakhya Trading Co! We manufacture premium Kurtis, Sarees, Bridal Lehengas, Western wear, and Girls Partywear at direct mill rates. Let me know what styles or budget you are exploring!",
      action: 'general'
    };
  };

  // Send message
  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const replyData = processQuery(userMsg.text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyData.text,
        recommended: replyData.recommended || null,
        action: replyData.action || null
      };

      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
      speakText(replyData.text);
    }, 450);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black hover:bg-neutral-900 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 transition-all hover:scale-105 active:scale-95 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
          <span className="text-base">🤖</span>
          <div className="text-left text-xs">
            <span className="font-black block leading-none">AI Wholesale Assistant</span>
            <span className="text-[10px] text-gray-400 font-medium">हिंदी • English • 🎙️ Voice</span>
          </div>
        </button>
      </div>

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-sm shadow-md">
                🤖
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-tight flex items-center gap-1.5">
                  <span>Kamakhya AI Stylist</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-gray-400">Understands Hindi, English & Voice</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Output Toggle */}
              <button
                onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isSpeakingEnabled ? 'bg-purple-900 text-purple-300' : 'text-gray-400 hover:text-white'
                }`}
                title={isSpeakingEnabled ? "Voice Output Active (Read aloud)" : "Voice Output Muted (Click to enable audio speech)"}
              >
                {isSpeakingEnabled ? '🔊' : '🔇'}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="p-2 bg-gray-50 border-b border-gray-200 flex gap-1.5 overflow-x-auto text-[11px] font-bold scrollbar-none flex-shrink-0">
            <button
              onClick={() => handleSendMessage("Mujhe 600 ke andar best kurti dikhao")}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-700 whitespace-nowrap shadow-2xs"
            >
              👗 Kurti under ₹600
            </button>
            <button
              onClick={() => handleSendMessage("Bridal lehenga ka wholesale rate kya hai?")}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-700 whitespace-nowrap shadow-2xs"
            >
              👰 Bridal Lehenga
            </button>
            <button
              onClick={() => handleSendMessage("Wholesale MOQ kitna hai?")}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-700 whitespace-nowrap shadow-2xs"
            >
              📦 MOQ Details
            </button>
            <button
              onClick={() => handleSendMessage("Boutique profit kaise calculate karein?")}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-700 whitespace-nowrap shadow-2xs"
            >
              💰 Profit Margins
            </button>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/60">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-gray-900 border border-gray-200 shadow-xs rounded-tl-sm'
                        : 'bg-black text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Render Mini Recommended Cards */}
                    {msg.recommended && (
                      <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-2">
                        {msg.recommended.map((item) => (
                          <div key={item.id} className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                            <img src={item.image} alt={item.title} className="w-10 h-12 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-[11px] block truncate">{item.title}</span>
                              <span className="text-[10px] text-emerald-600 font-black">₹{item.wholesale_price}/pc</span>
                            </div>
                            {onOpenTryOn && (
                              <button
                                onClick={() => {
                                  onOpenTryOn(item);
                                  setIsOpen(false);
                                }}
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold border border-purple-200"
                              >
                                Try On ✨
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Quick Actions */}
                    {msg.action === 'open_calculator' && onOpenCalculator && (
                      <button
                        onClick={() => {
                          onOpenCalculator();
                          setIsOpen(false);
                        }}
                        className="mt-2 w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-200 text-center"
                      >
                        Open Boutique Margin Estimator 📊
                      </button>
                    )}

                    {msg.action === 'open_tryon' && onOpenTryOn && (
                      <button
                        onClick={() => {
                          onOpenTryOn(products[0]);
                          setIsOpen(false);
                        }}
                        className="mt-2 w-full py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-[11px] font-bold border border-purple-200 text-center"
                      >
                        Launch AI Virtual Try-On Studio ✨
                      </button>
                    )}

                    {msg.action === 'open_restock' && (
                      <a
                        href={`https://wa.me/${OWNER_PHONE}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block w-full py-1.5 px-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-lg text-[11px] font-bold text-center"
                      >
                        Chat Directly on WhatsApp (+91 63506 26582) 📲
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 p-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px]">Kamakhya AI thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-1.5 flex-shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder={isListening ? "Listening... Speak in Hindi or English" : "Ask in Hindi or English (e.g. kurti under 700)..."}
              className="flex-1 px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
            />

            {/* Microphone Button (Speech to Text) */}
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isListening ? "Listening... Speak now" : "Speak your question (Hindi or English)"}
            >
              🎙️
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2 bg-black hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors"
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}
