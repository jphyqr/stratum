import React from 'react';

const FAQPage: React.FC = () => {
    const faqs = [
        {
            question: "What is your return policy?",
            answer: "You can return any item within 30 days of purchase."
        },
        {
            question: "How do I track my order?",
            answer: "You can track your order using the tracking number provided in your confirmation email."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we offer international shipping to most countries."
        }
    ];

    return (
        <div>
            <h1>Frequently Asked Questions</h1>
            <ul>
                {faqs.map((faq, index) => (
                    <li key={index}>
                        <h2>{faq.question}</h2>
                        <p>{faq.answer}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FAQPage;