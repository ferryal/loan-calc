"use client";

import { useState } from "react";

// Helper function to format number with dots (Indonesian currency style)
const formatNumber = (number: string) => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper function to remove dots from formatted input for calculation
const unformatNumber = (formattedNumber: string) => {
  return formattedNumber.replace(/\./g, "");
};

// Helper function to format the installment result
const formatCurrency = (amount: number) => {
  // Format the amount with two decimal places separated by commas and thousands by dots
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(amount);

  // Replace Rp to avoid duplication, and adjust to the required format
  return formattedAmount
    .replace("Rp", "Rp ")
    .replace(",00", ",00")
    .replace(".", ".");
};

export default function Home() {
  const [OTR, setOTR] = useState("240000000"); // Initial value for OTR
  const [downPayment, setDownPayment] = useState("20"); // Initial DP percentage (20%)
  const [duration, setDuration] = useState("18"); // Initial loan duration in months (1.5 years = 18 months)
  const [installment, setInstallment] = useState<string | null>(null); // Result of the installment calculation, allowing string or null

  // Function to validate input and ensure it's a number
  const isNumeric = (value: string) => /^\d+$/.test(value);

  // Function to calculate installment
  const calculateInstallment = () => {
    const OTRValue = isNumeric(unformatNumber(OTR))
      ? parseFloat(unformatNumber(OTR))
      : 0;
    const downPaymentValue = isNumeric(downPayment)
      ? parseFloat(downPayment)
      : 0;
    const durationValue = isNumeric(duration) ? parseFloat(duration) : 0;

    const DPAmount = (downPaymentValue / 100) * OTRValue; // Calculate DP amount
    const loanAmount = OTRValue - DPAmount; // Loan amount after down payment
    let interestRate;

    // Determine interest rate based on loan duration
    if (durationValue <= 12) {
      interestRate = 0.12;
    } else if (durationValue > 12 && durationValue <= 24) {
      interestRate = 0.14;
    } else {
      interestRate = 0.165;
    }

    // Monthly installment calculation
    const monthlyInstallment =
      (loanAmount + loanAmount * interestRate) / durationValue;
    setInstallment(formatCurrency(monthlyInstallment)); // Format the result to Indonesian currency format
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-5">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Car Loan Calculator
        </h1>
        <div className="mb-4">
          <label className="block mb-1">OTR (On The Road Price): </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formatNumber(OTR)}
            onChange={(e) => setOTR(e.target.value.replace(/[^\d]/g, ""))} // Accept only numeric input, removing dots
            placeholder="Enter OTR price"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Down Payment (%): </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value.replace(/\D/g, ""))} // Remove non-numeric characters
            placeholder="Enter down payment percentage"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Duration (months): </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={duration}
            onChange={(e) => setDuration(e.target.value.replace(/\D/g, ""))} // Remove non-numeric characters
            placeholder="Enter duration in months"
          />
        </div>
        <button
          onClick={calculateInstallment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          Calculate Installment
        </button>

        {installment && (
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold">Monthly Installment:</h2>
            <p className="text-2xl font-bold">{installment}</p>
          </div>
        )}
      </div>
    </div>
  );
}
