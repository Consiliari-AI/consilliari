import { z } from "zod";
import {
  accountabilityOptions,
  industryGrowthTrajectoryPerceptionOptions,
  perceiveAsALeaderOptions,
  preferredCoachingStyleOptions,
  reactionToSetbackOptions,
  readinessForNextRoleOptions,
  relationWithManagerOptions,
  teamPerformanceOptions,
} from "../constants/onboardingData.js";

const goalsSchema = z
  .object({
    short_term_goal: z
      .string({
        required_error: "Short term goal is required",
        invalid_type_error: "Short term goal must be a string",
      })
      .max(1000, "Short term goal is too long")
      .optional(), // Make it optional at first

    long_term_goal: z
      .string({
        required_error: "Long term goal is required",
        invalid_type_error: "Long term goal must be a string",
      })
      .max(1000, "Long term goal is too long")
      .min(1, "Long term goal is required"),

    no_goals: z.boolean({
      required_error: "No goals selection is required",
      invalid_type_error: "No goals must be a boolean",
    }),

    readiness_for_next_goal: z.enum(readinessForNextRoleOptions, {
      required_error: "Readiness for next goal is required",
      invalid_type_error: "Invalid readiness level",
    }),

    development_for_next_role: z
      .string({
        required_error: "Development for next role is required",
        invalid_type_error: "Development for next role must be a string",
      })
      .min(1, "Development for next role cannot be empty")
      .max(1000, "Development for next role is too long"),

    challenges_for_goals: z
      .string({
        required_error: "Challenges for goals is required",
        invalid_type_error: "Challenges for goals must be a string",
      })
      .min(1, "Challenges for goals cannot be empty")
      .max(1000, "Challenges for goals is too long"),

    clarity_on_overcoming_obstacle: z.coerce
      .number({
        required_error: "Clarity rating is required",
        invalid_type_error: "Clarity must be a number between 1 and 5",
      })
      .min(1, "Minimum value is 1")
      .max(5, "Maximum value is 5"),
  })
  .superRefine((data, ctx) => {
    if (!data.no_goals) {
      if (!data.short_term_goal || data.short_term_goal.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["short_term_goal"],
          message: "Short term goal is required",
        });
      }
    }
  });

const personalAlignmentSchema = z.object({
  rating: z.coerce
    .number({
      required_error: "Personal alignment rating is required",
      invalid_type_error: "Personal alignment rating must be a number",
    })
    .min(1, "Personal alignment rating cannot be empty")
    .max(5, "Personal alignment Rating must be between 1 and 5"),

  explaination: z
    .string({
      required_error: "Personal alignment explanation is required",
      invalid_type_error: "Personal alignment explanation must be a string",
    })
    .min(1, "Personal alignment explanation cannot be empty")
    .max(1000, "Personal alignment explanation is too long"),
});

const seniorityPerceptionSchema = z.object({
  isTrue: z.boolean({
    required_error: "Seniority perception is required",
    invalid_type_error: "Seniority perception status must be a boolean",
  }),

  explaination: z
    .string({
      required_error: "Seniority perception explanation is required",
      invalid_type_error: "Seniority perception explanation must be a string",
    })
    .min(1, "Seniority perception explanation cannot be empty")
    .max(1000, "Seniority perception explanation is too long"),
});

const momentumSchema = z.object({
  growth_in_responsibility: z
    .string({
      required_error: "Growth in responsibility is required",
      invalid_type_error: "Growth in responsibility must be a string",
    })
    .min(1, "Growth in responsibility cannot be empty")
    .max(1000, "Growth in responsibility is too long"),

  recent_skill_development: z
    .string({
      required_error: "Recent skill development is required",
      invalid_type_error: "Recent skill development must be a string",
    })
    .min(1, "Recent skill development cannot be empty")
    .max(1000, "Recent skill development is too long"),

  proactive_career_activities: z
    .string({
      required_error: "Proactive career activities is required",
      invalid_type_error: "Proactive career activities must be a string",
    })
    .min(1, "Proactive career activities cannot be empty")
    .max(1000, "Proactive career activities is too long"),

  learning_agility: z
    .string({
      required_error: "Learning agility is required",
      invalid_type_error: "Learning agility must be a string",
    })
    .min(1, "Learning agility cannot be empty")
    .max(1000, "Learning agility is too long"),

  proactive_learning_example: z
    .string({
      required_error: "Proactive learning example is required",
      invalid_type_error: "Proactive learning example must be a string",
    })
    .min(1, "Proactive learning example cannot be empty")
    .max(1000, "Proactive learning example is too long"),

  personal_alignment_fulfilment: personalAlignmentSchema,
  seniority_perception: seniorityPerceptionSchema,

  industry_growth_trajectory_perception: z.enum(industryGrowthTrajectoryPerceptionOptions, {
    required_error: "Industry growth trajectory perception is required",
    invalid_type_error: "Invalid industry growth perception value",
  }),
});

const marketViewSchema = z.object({
  annual_salary: z.coerce
    .number({
      required_error: "Annual salary is required",
      invalid_type_error: "Annual salary must be a number",
    })
    .min(1, "Annual Salary is required")
    .nonnegative("Annual salary must be a non-negative number"),

  annual_bonus: z.coerce
    .number({
      invalid_type_error: "Annual bonus must be a number",
    })
    .nonnegative("Annual bonus must be a non-negative number")
    .optional()
    .default(0),

  equity: z.coerce
    .number({
      invalid_type_error: "Equity must be a number",
    })
    .nonnegative("Equity must be a non-negative number")
    .optional()
    .default(0),

  other_compensation: z.coerce
    .number({
      invalid_type_error: "Other compensation must be a number",
    })
    .nonnegative("Other compensation must be a non-negative number")
    .optional()
    .default(0),

  compensation_growth_trajectory: z
    .string({
      required_error: "Compensation growth trajectory is required",
      invalid_type_error: "Compensation growth trajectory must be a string",
    })
    .min(1, "Compensation growth trajectory cannot be empty")
    .max(1000, "Compensation growth trajectory is too long"),
});

const workStyleSchema = z.object({
  preferred_coaching_style: z.enum(preferredCoachingStyleOptions, {
    required_error: "Preferred coaching style is required",
    invalid_type_error: "Preferred coaching style must be one of the allowed values",
  }),

  accountability_methods: z
    .array(
      z.string({
        required_error: "Motivation and accountability method is required",
        invalid_type_error: "Motivation and accountability method must be a string",
      })
    )
    .min(1, "At least one motivation and accountability method is required"),

  reaction_to_setback: z.enum(reactionToSetbackOptions, {
    required_error: "Reaction to setback is required",
    invalid_type_error: "Reaction must be one of the allowed options",
  }),

  excitement_about_consiliari: z
    .string({
      invalid_type_error: "Excitement about Consiliari must be a string",
    })
    .max(500, "Excitement about Consiliari is too long")
    .optional(),
});

const selfLeadershipAssessmentSchema = z.object({
  self_awareness: z.coerce
    .number({
      required_error: "Self-awareness is required",
      invalid_type_error: "Self-awareness must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  effective_communication: z.coerce
    .number({
      required_error: "Effective communication is required",
      invalid_type_error: "Effective communication must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  interpersonal_relations: z.coerce
    .number({
      required_error: "Interpersonal relations is required",
      invalid_type_error: "Interpersonal relations must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  vision: z.coerce
    .number({
      required_error: "Vision is required",
      invalid_type_error: "Vision must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  time_management: z.coerce
    .number({
      required_error: "Time management is required",
      invalid_type_error: "Time management must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  decision_making: z.coerce
    .number({
      required_error: "Decision making is required",
      invalid_type_error: "Decision making must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  developing_team_members: z.coerce
    .number({
      required_error: "Developing team members is required",
      invalid_type_error: "Developing team members must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  team_performance_leadership: z.coerce
    .number({
      required_error: "Team performance leadership is required",
      invalid_type_error: "Team performance leadership must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  conflict_resolution: z.coerce
    .number({
      required_error: "Conflict resolution is required",
      invalid_type_error: "Conflict resolution must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  strategic_thinking: z.coerce
    .number({
      required_error: "Strategic thinking is required",
      invalid_type_error: "Strategic thinking must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  organizational_collaboration: z.coerce
    .number({
      required_error: "Organizational collaboration is required",
      invalid_type_error: "Organizational collaboration must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),

  executive_presence: z.coerce
    .number({
      required_error: "Executive presence is required",
      invalid_type_error: "Executive presence must be a number between 0 and 100",
    })
    .min(0, "Minimum is 0")
    .max(100, "Maximum is 100"),
});

const leadershipCapabilitiesSchema = z.object({
  is_manage_team: z.boolean({
    required_error: "Team management status is required",
    invalid_type_error: "Team management status must be a boolean",
  }),

  team_overall_performance: z.enum(teamPerformanceOptions, {
    required_error: "Team overall performance is required",
    invalid_type_error: "Must be one of the allowed performance levels",
  }),

  perceive_as_a_leader: z.enum(perceiveAsALeaderOptions, {
    required_error: "Leadership perception is required",
    invalid_type_error: "Must be a valid leadership perception option",
  }),

  relation_with_manager: z.enum(relationWithManagerOptions, {
    required_error: "Relation with manager is required",
    invalid_type_error: "Must be a valid option for relation with manager",
  }),
  self_leadership_assessment: selfLeadershipAssessmentSchema,
});

// Export the main career blueprint schema
export const careerBlueprintSchema = z.object({
  goals: goalsSchema,
  momentum: momentumSchema,
  market_view: marketViewSchema,
  work_style: workStyleSchema,
  leadership_capabilities: leadershipCapabilitiesSchema,
});
