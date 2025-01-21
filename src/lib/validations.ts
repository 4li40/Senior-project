import { z } from "zod";

export const studentSignupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name must be less than 20 characters")
    .regex(/^[a-zA-Z]+$/, "First name can only contain alphabets"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name must be less than 20 characters")
    .regex(/^[a-zA-Z]+$/, "Last name can only contain alphabets"),
  email: z
    .string()
    .email("Invalid email address")
    .max(50, "Email must be less than 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password must be less than 50 characters"),
    phoneNumber: z
    .string()
    .regex(
      /^(?:3|7[0-9]|1|4|5|6|8|9|81)\d{6}$/,
      "Phone number must be a valid Lebanese number"
    ),
  
  educationLevel: z.string().min(1, "Education level is required"),
  school: z
    .string()
    .min(1, "School/Institution is required")
    .max(50, "School name must be less than 50 characters"),
  subjects: z
    .array(z.string())
    .min(1, "Select at least one subject")
    .max(5, "You can select up to 5 subjects"),
  goals: z.string().optional(),
  agreedToTerms: z
  .boolean({
    required_error: "You must agree to the Terms of Service",
  })
  .refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),
});