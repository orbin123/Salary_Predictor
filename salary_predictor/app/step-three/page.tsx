"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { evaluateProjects } from "@/utils/evaluateProjects";
import { useFormStore } from "@/store/formStore";
import { predictSalary } from "@/utils/predictSalary";
import changeForm from "@/lib/changeFormdata";

type FormInputs = {
  project_1: string;
  project_2: string;
  project_3: string;
};

const formSchema = z.object({
  project_1: z
    .string()
    .min(250, { message: "Project description is required" }),
  project_2: z
    .string()
    .min(250, { message: "Project description is required" }),
  project_3: z
    .string()
    .min(250, { message: "Project description is required" }),
});

const items: {
  id: keyof FormInputs;
  title: string;
  description: string;
  placeholder: string;
}[] = [
  {
    id: "project_1",
    title: "Project 1",
    description:
      "Describe your project, including the tech stack and technologies used.(min 250 words)",
    placeholder:
      "E.g., Developed an interactive multi-step form web app using React, TypeScript, and Tailwind CSS to collect user input across several features...",
  },
  {
    id: "project_2",
    title: "Project 2",
    description:
      "Describe your project, including the tech stack and technologies used.(min 250 words)",
    placeholder:
      "E.g., Built a responsive dashboard for small businesses to track stock and sales in real-time using React and Django...",
  },
  {
    id: "project_3",
    title: "Project 3",
    description:
      "Describe your project, including the tech stack and technologies used.(min 250 words)",
    placeholder:
      "E.g., Created a collaborative note-taking app with real-time sync using Next.js and Firebase...",
  },
];

export default function StepThree() {
  const [projects, setProjects] = useState(["", "", ""]);
  const [scores, setScores] = useState<number[] | null>(null);
  const router = useRouter();
  const { formData, updateFormData, setStep, clearForm } = useFormStore();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_1: "",
      project_2: "",
      project_3: "",
    },
  });

  useEffect(() => {
    setStep(3);
  }, []);

  const handleSubmit = async (values: FormInputs) => {
    try {
      // First, get project descriptions
      const projectDescriptions = [
        values.project_1.trim().replace(/^"|"$/g, ""),
        values.project_2.trim().replace(/^"|"$/g, ""),
        values.project_3.trim().replace(/^"|"$/g, ""),
      ];

      // Get project scores from OpenAI
      const result = await evaluateProjects(projectDescriptions);
      setScores(result);

      // Update form data with project scores
      const completeFormData = {
        ...formData,
        project_1: result[0].toString(),
        project_2: result[1].toString(),
        project_3: result[2].toString(),
      };

      // First update the form store
      await updateFormData(completeFormData);

      // Then predict salary using the complete form data
      const predictedSalary = await predictSalary(completeFormData);

      // Navigate to result page with the salary
      router.push(`/result-page?salary=${predictedSalary}`);

      // Clear form after successful submission
      clearForm();
    } catch (err) {
      console.error("Error in form submission:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Project Details
            </h2>
            <p className="text-gray-600">
              Share your most significant projects with detailed descriptions
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={item.id}
                  render={({ field }) => (
                    <FormItem className="bg-gray-50 p-6 rounded-lg transition-all duration-200 hover:bg-gray-100">
                      <FormLabel className="text-base font-semibold text-gray-700">
                        {item.title}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={item.placeholder}
                          {...field}
                          className="mt-2 min-h-[180px] p-4 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-shadow"
                        />
                      </FormControl>
                      <FormDescription className="mt-2 text-sm text-gray-600">
                        {item.description}
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 
                            text-white px-8 py-3 rounded-lg
                            transform transition-all duration-200 hover:scale-105
                            font-medium text-lg shadow-lg hover:shadow-xl
                            flex items-center gap-2"
                >
                  <span>Predict</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
