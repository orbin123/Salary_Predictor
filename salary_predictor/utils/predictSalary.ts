// utils/predictSalary.ts
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
  [key: string]: string; // Index signature
}

interface TransformedFeatures {
  feature1: number;
  feature2: number;
  feature3: number;
  feature4: number;
  feature5: number;
  feature6: number;
  feature7: number;
  feature8: number;
  feature9: number;
  feature10: string;
}

export async function predictSalary(features: FormDataType) {
  try {
    // Transform features into the format expected by Django
    const transformedFeatures: TransformedFeatures = {
      feature1: parseFloat(features.leetcode), // FloatField
      feature2: parseFloat(features.project_1), // FloatField
      feature3: parseFloat(features.project_2), // FloatField
      feature4: parseFloat(features.project_3), // FloatField
      feature5: parseFloat(features.full_stack_projects), // FloatField
      feature6: parseFloat(features.experience), // FloatField
      feature7: parseFloat(features.certifications), // FloatField
      feature8: parseFloat(features.cgpa), // FloatField
      feature9:
        features.non_IT_student_or_not.toLowerCase() === "yes" ? 1.0 : 0.0, // FloatField
      feature10: features.communication.toLowerCase(), // CharField - ensure lowercase
    };

    // Validate that all number fields are actually numbers
    Object.entries(transformedFeatures).forEach(([key, value]) => {
      if (key !== "feature10" && (isNaN(value) || value === null)) {
        console.error(`Invalid value for ${key}:`, value);
        console.error("Original value:", features[key.replace("feature", "")]);
        throw new Error(`Invalid number for ${key}`);
      }
    });

    // Validate that communication is not empty
    if (!transformedFeatures.feature10) {
      throw new Error("Communication level is required");
    }

    console.log("Sending features to backend:", transformedFeatures);

    const response = await fetch("http://127.0.0.1:8000/api/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(transformedFeatures),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Server returned non-JSON response: ${await response.text()}`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.error || "Failed to predict salary");
    }

    if (typeof data.salary !== "number") {
      console.error("Invalid salary in response:", data);
      throw new Error("Invalid salary value received");
    }

    return data.salary;
  } catch (error) {
    console.error("Error predicting salary:", error);
    throw error;
  }
}
