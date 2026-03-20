'use client';

import { useState } from 'react';

interface FAQProps {
  title?: string;
  items?: Array<{ question: string; answer: string }>;
}

export default function FAQ({ title, items = [] }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-medium hover:bg-gray-50 transition-colors"
              >
                {item.question}
                <span className={`transform transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
