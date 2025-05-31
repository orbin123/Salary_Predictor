"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { useFormStore } from "@/store/formStore";
import { useEffect } from "react";

type FormInputs = {
  experience: string;
  certifications: string;
  cgpa: string;
  non_IT_student_or_not: string;
};

const formSchema = z.object({
  experience: z.string(),
  certifications: z.string(),
  cgpa: z.string(),
  non_IT_student_or_not: z.string(),
});

const items = [
  {
    id: "experience" as const,
    title: "Experience",
    description: "How many years of experience do you have?",
    placeholder: "Select years of experience",
    type: "select",
    options: ["0", "0.5", "1.0", "1.5", "2.0"],
  },
  {
    id: "certifications" as const,
    title: "Certifications",
    description: "How many certifications do you have? (in numbers)",
    placeholder: "8",
    type: "input",
  },
  {
    id: "cgpa" as const,
    title: "CGPA",
    description:
      "What is your CGPA in college? (if None try to fill it with +2 or 10th percentage scaled to 10)",
    placeholder: "9.95",
    type: "input",
  },
  {
    id: "non_IT_student_or_not" as const,
    title: "Non IT Student",
    description: "Are you a Non IT Student or Professional?",
    placeholder: "Select option",
    type: "select",
    options: ["Yes", "No"],
  },
] as const;

export default function StepOne() {
  const router = useRouter();
  const { formData, updateFormData, setStep } = useFormStore();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: formData.experience,
      certifications: formData.certifications,
      cgpa: formData.cgpa,
      non_IT_student_or_not: formData.non_IT_student_or_not,
    },
  });

  useEffect(() => {
    setStep(1);
  }, []);

  function onSubmit(values: FormInputs) {
    updateFormData(values);
    router.push("/step-two");
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Basic Information
            </h1>
            <p className="text-gray-600">
              Let's start with your background details
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={item.id}
                  render={({ field }) => (
                    <FormItem className="bg-gray-50 p-5 rounded-lg transition-all duration-200 hover:bg-gray-100">
                      <FormLabel className="text-base font-semibold text-gray-700">
                        {item.title}
                      </FormLabel>
                      <FormControl>
                        {item.type === "select" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="mt-2 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <SelectValue placeholder={item.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder={item.placeholder}
                            {...field}
                            className="mt-2 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        )}
                      </FormControl>
                      <FormDescription className="mt-2 text-sm text-gray-600">
                        {item.description}
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg
                            transform transition-all duration-200 hover:scale-105
                            font-medium text-base shadow-md hover:shadow-lg
                            flex items-center space-x-2"
                >
                  <span>Next</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
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
