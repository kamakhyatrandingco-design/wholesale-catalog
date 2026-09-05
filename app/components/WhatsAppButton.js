'use client';
export default function WhatsAppButton({ title, sku, moq }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  
  const handleOrder = () => {
    const text = `Hello! I am a wholesale buyer interested in: \n\n*Product:* ${title} \n*SKU:* ${sku} \n*Quantity:* (MOQ is ${moq} sets, I want __ sets) \n\nPlease confirm stock availability.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button onClick={handleOrder} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-2 transition-all">
      Order / Inquire on WhatsApp
    </button>
  );
}