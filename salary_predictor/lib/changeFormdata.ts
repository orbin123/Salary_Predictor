interface FormDataType {
  experience: string;
  certifications: string;
  cgpa: string;
  non_IT_student_or_not: string;
  leetcode: string;
  full_stack_projects: string;
  communication: string;
  project_1: string;
  project_2: string;
  project_3: string;
}

export default async function changeForm(
  formData: FormDataType
): Promise<number[]> {
  // Convert Yes/No to 1/0 for Non-IT student
  const nonITValue =
    formData.non_IT_student_or_not.toLowerCase() === "yes" ? 1 : 0;

  // Map communication level to numeric values
  const communicationMap: { [key: string]: number } = {
    beginner: 0,
    fluent: 1,
    expert: 2,
    exceptional: 3,
  };

  // Return array in the exact order needed for the model
  return [
    parseInt(formData.leetcode), // feature1: Leetcode_completed
    parseFloat(formData.project_1), // feature2: Project_1_score
    parseFloat(formData.project_2), // feature3: Project_2_score
    parseFloat(formData.project_3), // feature4: Project_3_score
    parseInt(formData.full_stack_projects), // feature5: Total_full_stack_projects
    parseFloat(formData.experience), // feature6: Years_of_experience
    parseInt(formData.certifications), // feature7: No_of_certifications
    parseFloat(formData.cgpa), // feature8: CGPA
    nonITValue, // feature9: Non_IT_student
    communicationMap[formData.communication.toLowerCase()] || 0, // feature10: Communication_Level
  ];
}
