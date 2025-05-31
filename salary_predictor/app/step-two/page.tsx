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
  leetcode: string;
  full_stack_projects: string;
  communication: string;
};

const formSchema = z.object({
  leetcode: z.string(),
  full_stack_projects: z.string(),
  communication: z.string(),
});

const items = [
  {
    id: "leetcode" as const,
    title: "Leetcode",
    description: "How many Leetcode questions have you solved?(in numbers)",
    placeholder: "354",
  },
  {
    id: "full_stack_projects" as const,
    title: "Full Stack Projects",
    description: "How many Full Stack Projects have you completed?(in numbers)",
    placeholder: "10",
  },
  {
    id: "communication" as const,
    title: "Communication Level",
    description: "Choose from Beginner, Fluent, Expert, Exceptional.",
    placeholder: "Fluent",
  },
] as const;

export default function StepTwo() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leetcode: formData.leetcode,
      full_stack_projects: formData.full_stack_projects,
      communication: formData.communication,
    },
  });

  useEffect(() => {
    // Pre-fill form with stored data
    form.reset({
      leetcode: formData.leetcode,
      full_stack_projects: formData.full_stack_projects,
      communication: formData.communication,
    });
  }, []);

  function onSubmit(values: FormInputs) {
    updateFormData(values);
    router.push("/step-three");
  }
  const handlePrevious = () => {
    // Save current form state before navigation
    const currentValues = form.getValues();
    updateFormData(currentValues);
    router.push("/step-one");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Technical Details
            </h2>
            <p className="text-gray-600">
              Tell us about your technical expertise
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
                        {item.id === "communication" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="mt-2 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <SelectValue placeholder="Select communication level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Fluent">Fluent</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                              <SelectItem value="Exceptional">
                                Exceptional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder={item.placeholder}
                            {...field}
                            className="mt-2 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg
                            transform transition-all duration-200 hover:scale-105
                            font-medium text-base shadow-md hover:shadow-lg"
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
