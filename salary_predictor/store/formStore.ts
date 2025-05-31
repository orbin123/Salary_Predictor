import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormState {
  formData: {
    // Step One
    experience: string;
    certifications: string;
    cgpa: string;
    non_IT_student_or_not: string;
    // Step Two
    leetcode: string;
    full_stack_projects: string;
    communication: string;
    // Step Three
    project_1: string;
    project_2: string;
    project_3: string;
  };
  currentStep: number;
  updateFormData: (data: Partial<FormState["formData"]>) => void;
  setStep: (step: number) => void;
  clearForm: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formData: {
        experience: "",
        certifications: "",
        cgpa: "",
        non_IT_student_or_not: "",
        leetcode: "",
        full_stack_projects: "",
        communication: "",
        project_1: "",
        project_2: "",
        project_3: "",
      },
      currentStep: 1,
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setStep: (step) => set({ currentStep: step }),
      clearForm: () =>
        set({
          formData: {
            experience: "",
            certifications: "",
            cgpa: "",
            non_IT_student_or_not: "",
            leetcode: "",
            full_stack_projects: "",
            communication: "",
            project_1: "",
            project_2: "",
            project_3: "",
          },
          currentStep: 1,
        }),
    }),
    {
      name: "salary-predictor-storage",
    }
  )
);
