import React from 'react';

const faqs = [
  { q: "How do I earn Vitacoins?", a: "You earn Vitacoins by completing tasks and transactions in the app." },
  { q: "How do badges work?", a: "Badges are earned based on your coin balance and other achievements." },
  { q: "How to reset my password?", a: "Use the Forgot Password feature on the login page." },
  // Add more as needed
];

const FAQ = () => (
  <div style={{ padding: 20 }}>
    <h2>Frequently Asked Questions</h2>
    {faqs.map(({ q, a }, index) => (
      <div key={index} style={{ marginBottom: 15 }}>
        <h4>{q}</h4>
        <p>{a}</p>
      </div>
    ))}
  </div>
);

export default FAQ;
