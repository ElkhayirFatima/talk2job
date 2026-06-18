import { isDev } from "./helpers.js";

export const pricingPlans   = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "Upload up to 5 documents per month",
      "AI summaries",
      "Basic flashcards",
      "Limited quizzes",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Basic",
    price: "$9",
    period: "/month",
    features: [
      "Upload up to 20 documents per month",
      "Summaries & flashcards",
      "Quizzes included",
      "Faster AI processing",
    ],
    paymentLink:
        isDev ? "https://buy.stripe.com/test_9B6fZhcuM0Z41bz8AW3Nm00" : "",
    priceId:
        isDev ? "price_1SwMIRH0E5sQfhLbaMHj5efz" : "",

    cta: "Upgrade to Basic",
    popular: true, // Most Popular
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: [
      "Unlimited document uploads",
      "Summaries, flashcards & quizzes",
      "Advanced AI insights",
      "Priority processing",
    ],
    paymentLink:
      isDev ? "https://buy.stripe.com/test_8x23cv3YgcHMcUh3gC3Nm01" : "",
    priceId:
      isDev ? "price_1SwMIRH0E5sQfhLbPvnPeR3d" : "",
    cta: "Go Pro",
    popular: false,
  },
];