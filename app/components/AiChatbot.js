'use client';

import { useState, useRef, useEffect } from 'react';

const OWNER_PHONE = "916350626582";

export default function AiChatbot({
  products = [],
  onOpenRestock = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Welcome to KTC Wholesale Trade Desk. We assist verified boutique owners with factory direct mill rates, minimum order quantities (MOQ), fabric specifications, and custom lot bookings in English or Hindi.',
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
      recognition.lang = 'hi-IN';
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
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India'));
    if (indVoice) utterance.voice = indVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Query Processor
  const processQuery = (rawQuery) => {
    const q = rawQuery.toLowerCase().trim();
    const isHindi = /(namaste|kya|hai|batao|chahiye|kitna|rate|bhejo|sasta|kaunsa|milega|mujhe|lehenga|kurti|saree|frock)/i.test(q);

    // 1. Price extraction
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
          text: "Kamakhya Trading Co me standard wholesale MOQ 25 se 30 pieces prati design lot hai. Quality assessment aur boutique testing ke liye aap Retail Mode select karke single sample piece bhi dispatch karwa sakte hain.",
          action: 'wholesale_info'
        };
      }
      return {
        text: "Standard wholesale production MOQ is 25 to 30 pieces per design lot. For quality inspection before high-volume commercial commitments, switch to Single Piece Sample Mode.",
        action: 'wholesale_info'
      };
    }

    // 4. Questions about profit / trade pricing
    if (/profit|margin|kamai|calculator|roi|rate/i.test(q)) {
      if (isHindi) {
        return {
          text: "Hamare sabhi rates direct Surat mill manufacturing prices par aadharit hain, jisme koi middlemen commission nahi hota. B2B invoices me 5% GST aur transport charges transparently calculate kiye jaate hain.",
          action: 'wholesale_info'
        };
      }
      return {
        text: "Our catalogue reflects direct Surat manufacturing mill prices with zero distributor markups. Invoices are generated with standard 5% textile GST and actual freight forwarding charges.",
        action: 'wholesale_info'
      };
    }

    // 5. Fitting and Sizing questions
    if (/size|sizing|fitting|pehan|look|alteration|tryon|try on/i.test(q)) {
      if (isHindi) {
        return {
          text: "Hamare sabhi suits, kurtis aur gowns standard Indian boutique sizing (M, L, XL, XXL) me ready stock me uplabdh hain, jinme 2-inch ka extra margin rehta hai alteration ke liye.",
          action: 'wholesale_info'
        };
      }
      return {
        text: "Garments are produced to standardized Indian boutique measurements (M, L, XL, XXL) with 2-inch interior seam allowances for custom alteration.",
        action: 'wholesale_info'
      };
    }

    // 6. Restock / Owner Contact
    if (/contact|owner|number|phone|restock|hariom/i.test(q)) {
      if (isHindi) {
        return {
          text: "Aap direct factory dispatch desk se WhatsApp ya call par baat kar sakte hain: +91 63506 26582. Ya niche diye gaye button se seedha WhatsApp message bhejein.",
          action: 'open_restock'
        };
      }
      return {
        text: "You can reach the primary mill dispatch desk directly on WhatsApp or telephone at +91 63506 26582 for custom weave schedules and bulk order confirmations.",
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
      const prodList = matchingProducts.map(p => `* ${p.title} (Rs ${p.wholesale_price}/pc, MOQ: ${p.moq || 30})`).join('\n');
      if (isHindi) {
        return {
          text: `Aapki request ke anusaar ready-stock lots:\n\n${prodList}\n\nAap inka lot direct Purchase Order me add kar sakte hain ya WhatsApp par verify kar sakte hain.`,
          recommended: matchingProducts
        };
      }
      return {
        text: `Commercial lots matching your query:\n\n${prodList}\n\nAdd directly to your wholesale Purchase Order or request immediate fabric swatch dispatch.`,
        recommended: matchingProducts
      };
    }

    // Default Fallback
    if (isHindi) {
      return {
        text: "Kamakhya Trading Co me Kurtis, Lehengas, Sarees, Western Tops aur Girls Frocks direct Surat mill rates par uplabdh hain. Kisi bhi design ka rate janne ya custom lot order karne ke liye WhatsApp desk par sampark karein (+91 63506 26582).",
        action: 'general'
      };
    }

    return {
      text: "KTC Fashion manufactures premium ethnic, bridal, western and junior apparel at direct mill prices. Specify your required style, fabric or budget for instant inventory lookup.",
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
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-neutral-900 hover:bg-black text-white pl-3.5 pr-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 border border-neutral-700 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          aria-label="Open Wholesale Desk"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <svg className="w-4 h-4 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="text-left text-xs">
            <span className="font-semibold block leading-none text-white tracking-wide">Wholesale Desk</span>
            <span className="text-[10px] text-stone-400 font-medium">B2B Trade Inquiries</span>
          </div>
        </button>
      </div>

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-sm border border-neutral-700 text-stone-200">
                <svg className="w-4 h-4 text-stone-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>KTC Trade Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-stone-400">Factory Dispatch & Commercial Desk</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Output Toggle */}
              <button
                onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  isSpeakingEnabled ? 'bg-neutral-800 text-stone-100 border border-neutral-700' : 'text-stone-400 hover:text-white'
                }`}
                title={isSpeakingEnabled ? "Audio narration active" : "Audio narration muted"}
                aria-label="Toggle audio narration"
              >
                {isSpeakingEnabled ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-md bg-neutral-900 hover:bg-neutral-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close wholesale desk"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="p-2 bg-stone-50 border-b border-stone-200 flex gap-1.5 overflow-x-auto text-[11px] font-medium scrollbar-none flex-shrink-0">
            <button
              onClick={() => handleSendMessage("Show kurti designs under 600")}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              Kurti under Rs 600
            </button>
            <button
              onClick={() => handleSendMessage("What are bridal lehenga wholesale rates?")}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              Bridal Lehenga Rates
            </button>
            <button
              onClick={() => handleSendMessage("What is the wholesale MOQ per design?")}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              Wholesale MOQ
            </button>
            <button
              onClick={() => handleSendMessage("Can I order a single piece sample?")}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              Sample Orders
            </button>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-stone-900 border border-stone-200 shadow-xs'
                        : 'bg-neutral-900 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Render Mini Recommended Cards */}
                    {msg.recommended && (
                      <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-2">
                        {msg.recommended.map((item) => (
                          <div key={item.id} className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                            <img src={item.image} alt={item.title} className="w-10 h-12 object-cover rounded-sm flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-[11px] block truncate text-stone-900">{item.title}</span>
                              <span className="text-[10px] text-stone-700 font-bold">Rs {item.wholesale_price}/pc (MOQ: {item.moq || 30})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.action === 'open_restock' && (
                      <a
                        href={`https://wa.me/${OWNER_PHONE}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-neutral-900 hover:bg-black text-white rounded-lg text-[11px] font-semibold text-center border border-neutral-800 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>Connect on WhatsApp (+91 63506 26582)</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500 p-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse [animation-delay:0.4s]"></span>
                <span className="text-[11px] font-medium text-stone-500">Retrieving wholesale records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-1.5 flex-shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder={isListening ? "Listening... Speak now" : "Ask about MOQ, fabric or pricing..."}
              className="flex-1 px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
            />

            {/* Microphone Button */}
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              title={isListening ? "Listening... Speak now" : "Voice input"}
              aria-label="Voice input"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2 bg-neutral-900 hover:bg-black disabled:opacity-30 text-white rounded-lg text-xs font-medium transition-colors"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
