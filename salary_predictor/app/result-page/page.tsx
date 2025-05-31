"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formattedSalary, setFormattedSalary] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const salary = searchParams?.get("salary");
    if (salary) {
      try {
        const numericSalary = parseFloat(salary);
        if (isNaN(numericSalary)) {
          throw new Error("Invalid salary value");
        }

        // Format the salary with commas and decimal points
        const formattedValue = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(numericSalary);

        setFormattedSalary(formattedValue);
      } catch (err) {
        setError("Unable to format salary value");
        console.error("Error formatting salary:", err);
      }
    } else {
      setError("No salary value provided");
    }
  }, [searchParams]);

  const handleTryAgain = () => {
    router.push("/step-one");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold mb-4">Predicted Annual Salary</h1>
        {formattedSalary && !error ? (
          <>
            <p className="text-4xl font-semibold text-green-600 mb-2">
              {formattedSalary}
            </p>
            <p className="text-gray-500 mb-6">per annum</p>
          </>
        ) : (
          <p className="text-red-500 mb-6">
            {error || "No salary prediction available"}
          </p>
        )}
        <button
          onClick={handleTryAgain}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Try Another Prediction
        </button>
      </div>
    </div>
  );
}
