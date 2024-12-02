import { z } from "zod";

// types.ts
interface NameContext {
    meaning?: string;
    variations?: {
        shortForm?: string;
        trademark?: string;
        pronunciation?: string;
    };
    brandArchetype?: string;
}
interface LogoPreferences {
    style: "wordmark" | "symbol" | "combination" | "emblem"
    preferences: {
        modern: boolean
        minimal: boolean
        technical: boolean
        playful: boolean
    }
    elements: string[]
    restrictions: string[]
}

interface BrandRequiredForLogo {
    name: string
    nameContext: {
        meaning: string
    }
    logoPreferences: LogoPreferences
    colors: {
        primary:
        hex: string
    }
    secondary: {
        hex: string
    }
}
valueProposition: {
    category: string
}
  }
interface LogoPreferences {
    style: "wordmark" | "symbol" | "combination" | "emblem";
    preferences: {
        modern: boolean;
        minimal: boolean;
        technical: boolean;
        playful: boolean;
    };
    elements: string[];
    restrictions: string[];
}

interface WritingGuide {
    headlines: {
        style: string;
        examples: string[];
    };
    paragraphs: {
        maxLength: number;
        style: string;
    };
    formatting: {
        lists: boolean;
        tables: boolean;
        codeBlocks: boolean;
    };
}
export function isReadyForLogoGeneration(brand: Partial<BrandRequiredForLogo>): {
    ready: boolean
    missingFields: string[]
} {
    const missingFields: string[] = []

    if (!brand.name?.trim()) missingFields.push('Brand Name')
    if (!brand.nameContext?.meaning?.trim()) missingFields.push('Name Meaning')
    if (!brand.logoPreferences?.style) missingFields.push('Logo Style')
    if (!brand.colors?.primary?.hex) missingFields.push('Primary Color')
    if (!brand.colors?.secondary?.hex) missingFields.push('Secondary Color')
    if (!brand.valueProposition?.category) missingFields.push('Product Category')

    return {
        ready: missingFields.length === 0,
        missingFields
    }
}
// Form schema


export const defaultValues = {
    name: "",
    tagline: "",
    description: "",
    nameContext: {
        meaning: "",
        variations: {
            shortForm: "",
            trademark: "",
            pronunciation: ""
        },
        brandArchetype: ""
    },
    valueProposition: {
        target: "",
        product: "",
        category: "",
        benefit: "",
        differentiator: ""
    },
    voiceTraits: [],
    voiceExamples: [],
    tonalityRules: [],
    preferredTerms: [],
    prohibitedTerms: [],
    primaryColor: {
        hex: "#000000",
        usage: "",
        meaning: ""
    },
    secondaryColor: {
        hex: "#ffffff",
        usage: "",
        meaning: ""
    },
    logoPreferences: {
        style: "wordmark",
        preferences: {
            modern: false,
            minimal: false,
            technical: false,
            playful: false
        },
        elements: [],
        restrictions: []
    },
    writingGuide: {
        headlines: {
            style: "",
            examples: []
        },
        paragraphs: {
            maxLength: 500,
            style: ""
        },
        formatting: {
            lists: true,
            tables: true,
            codeBlocks: true
        }
    },
    fontPrimary: "",
    fontSecondary: "",
    targetAudience: []
};


export const updateFormSchemaForDefaultTypes = z.object({
    name: z.string().min(1, "Brand name is required"),
    tagline: z.string().min(1, "Tagline is required"),
    description: z.string().min(1, "Description is required"),
    nameContext: z.object({
        meaning: z.string().min(1, "Meaning is required"),
        variations: z.object({
            shortForm: z.string().min(1, "Short form is required"),
            trademark: z.string().min(1, "Trademark is required"),
            pronunciation: z.string().min(1, "Pronunciation is required")
        }),
        brandArchetype: z.string().min(1, "Brand archetype is required")
    }),
    valueProposition: z.object({
        target: z.string().min(1, "Target audience is required"),
        product: z.string().min(1, "Product name is required"),
        category: z.string().min(1, "Category is required"),
        benefit: z.string().min(1, "Benefit is required"),
        differentiator: z.string().min(1, "Differentiator is required")
    }),
    voiceTraits: z.array(z.object({
        name: z.string().min(1, "Trait name is required"),
        application: z.string().min(1, "Trait application is required")
    })).min(1, "At least one voice trait is required"),
    voiceExamples: z.array(z.object({
        context: z.string().min(1, "Context is required"),
        text: z.string().min(1, "Example text is required")
    })).min(1, "At least one voice example is required"),
    tonalityRules: z.array(z.string()).min(1, "At least one tonality rule is required"),
    preferredTerms: z.array(z.object({
        use: z.string().min(1, "Term is required"),
        insteadOf: z.string().min(1, "Alternative is required"),
        context: z.string().min(1, "Usage context is required")
    })),
    prohibitedTerms: z.array(z.object({
        word: z.string().min(1, "Term is required"),
        reason: z.string().min(1, "Reason is required")
    })),
    colors: z.object({
        primary: z.object({
            hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            usage: z.string().min(1, "Usage description is required"),
            meaning: z.string().min(1, "Color meaning is required")
        }),
        secondary: z.object({
            hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            usage: z.string().min(1, "Usage description is required"),
            meaning: z.string().min(1, "Color meaning is required")
        }),
        accent: z.object({
            hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            usage: z.string().min(1, "Usage description is required"),
            meaning: z.string().min(1, "Color meaning is required")
        }).optional(),
        muted: z.object({
            hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            usage: z.string().min(1, "Usage description is required"),
            meaning: z.string().min(1, "Color meaning is required")
        }).optional(),
        ai: z.object({
            hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            usage: z.string().min(1, "Usage description is required"),
            meaning: z.string().min(1, "Color meaning is required")
        }).optional(),
        surface: z.object({
            background: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            foreground: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            card: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
            cardForeground: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color")
        }).optional(),
    }),

    logoPreferences: z.object({
        style: z.string().min(1, "Logo style is required"),
        preferences: z.object({
            modern: z.boolean(),
            minimal: z.boolean(),
            technical: z.boolean(),
            playful: z.boolean()
        }),
        elements: z.array(z.string()),
        restrictions: z.array(z.string())
    }),
    writingGuide: z.object({
        headlines: z.object({
            style: z.string().min(1, "Headline style is required"),
            examples: z.array(z.string()).min(1, "At least one headline example is required")
        }).optional(),
        paragraphs: z.object({
            maxLength: z.number().min(1, "Max length is required"),
            style: z.string().min(1, "Paragraph style is required")
        }),
        formatting: z.object({
            lists: z.boolean(),
            tables: z.boolean(),
            codeBlocks: z.boolean()
        }).optional()


    }),
    colorSystem: z.object({
        generated: z.boolean(),
        timestamp: z.string().datetime(),
        variant: z.string()
    }).optional(),

    targetAudience: z.array(z.object({
        type: z.string().min(1, "Audience type is required"),
        needs: z.array(z.string().min(1, "Need description is required"))
    })).min(1, "At least one target audience is required")
});


export const DEFAULT_DESIGN_TEMPLATES = [
    {
        name: "Monochrome Professional",
        description: "A clean, professional design system based on a single color with carefully balanced shades. Perfect for modern business applications.",
        colors: {
            primary: {
                hex: "#2563EB",
                usage: "Main brand elements",
                meaning: "Trust, professionalism, stability"
            },
            secondary: {
                hex: "#93C5FD",
                usage: "Supporting elements",
                meaning: "Approachability, subtlety"
            },
            accent: {
                hex: "#F59E0B",
                usage: "Call-to-action elements",
                meaning: "Energy, interaction points"
            },
            muted: {
                hex: "#F1F5F9",
                usage: "Background and subtle elements",
                meaning: "Clarity, structure"
            },
            ai: {
                hex: "#6366F1",
                usage: "AI-powered features",
                meaning: "Intelligence, automation"
            },
            surface: {
                background: "#FFFFFF",
                foreground: "#0F172A",
                card: "#F8FAFC",
                cardForeground: "#1E293B"
            }
        },
        fonts: {
            primary: {
                family: "Inter",
                usage: "Headers and primary UI elements"
            },
            secondary: {
                family: "Open Sans",
                usage: "Body text and secondary elements"
            }
        }
    },
    {
        name: "Natural Balance",
        description: "A calming, nature-inspired palette that creates a sense of harmony and organic flow. Great for wellness and sustainability focused brands.",
        colors: {
            primary: {
                hex: "#059669",
                usage: "Main brand elements",
                meaning: "Growth, nature, harmony"
            },
            secondary: {
                hex: "#34D399",
                usage: "Supporting elements",
                meaning: "Vitality, freshness"
            },
            accent: {
                hex: "#F97316",
                usage: "Call-to-action elements",
                meaning: "Energy, warmth"
            },
            muted: {
                hex: "#ECFDF5",
                usage: "Background and subtle elements",
                meaning: "Tranquility, space"
            },
            ai: {
                hex: "#0EA5E9",
                usage: "AI-powered features",
                meaning: "Innovation, intelligence"
            },
            surface: {
                background: "#FFFFFF",
                foreground: "#064E3B",
                card: "#F0FDF4",
                cardForeground: "#065F46"
            }
        },
        fonts: {
            primary: {
                family: "Work Sans",
                usage: "Headers and primary UI elements"
            },
            secondary: {
                family: "Source Sans Pro",
                usage: "Body text and secondary elements"
            }
        }
    },
    {
        name: "Tech Focus",
        description: "A modern, tech-forward palette emphasizing innovation and digital capability. Ideal for SaaS and technology products.",
        colors: {
            primary: {
                hex: "#7C3AED",
                usage: "Main brand elements",
                meaning: "Innovation, technology"
            },
            secondary: {
                hex: "#A78BFA",
                usage: "Supporting elements",
                meaning: "Accessibility, support"
            },
            accent: {
                hex: "#06B6D4",
                usage: "Call-to-action elements",
                meaning: "Interaction, engagement"
            },
            muted: {
                hex: "#F3F4F6",
                usage: "Background and subtle elements",
                meaning: "Clarity, focus"
            },
            ai: {
                hex: "#3B82F6",
                usage: "AI-powered features",
                meaning: "Intelligence, computation"
            },
            surface: {
                background: "#FAFAFA",
                foreground: "#18181B",
                card: "#FFFFFF",
                cardForeground: "#27272A"
            }
        },
        fonts: {
            primary: {
                family: "Roboto",
                usage: "Headers and primary UI elements"
            },
            secondary: {
                family: "Nunito Sans",
                usage: "Body text and secondary elements"
            }
        }
    },
    {
        name: "Creative Energy",
        description: "A vibrant, energetic palette that encourages creativity and expression. Perfect for creative tools and platforms.",
        colors: {
            primary: {
                hex: "#EC4899",
                usage: "Main brand elements",
                meaning: "Creativity, expression"
            },
            secondary: {
                hex: "#F472B6",
                usage: "Supporting elements",
                meaning: "Playfulness, accessibility"
            },
            accent: {
                hex: "#3B82F6",
                usage: "Call-to-action elements",
                meaning: "Action, flow"
            },
            muted: {
                hex: "#FDF2F8",
                usage: "Background and subtle elements",
                meaning: "Space, canvas"
            },
            ai: {
                hex: "#8B5CF6",
                usage: "AI-powered features",
                meaning: "Creative intelligence"
            },
            surface: {
                background: "#FFFFFF",
                foreground: "#831843",
                card: "#FFF1F2",
                cardForeground: "#9D174D"
            }
        },
        fonts: {
            primary: {
                family: "Outfit",
                usage: "Headers and primary UI elements"
            },
            secondary: {
                family: "DM Sans",
                usage: "Body text and secondary elements"
            }
        }
    }
];

export interface ColorPalette {
    name: string;
    description: string;
    colors: {
        primary: {
            hex: string;
            usage: string;
            meaning: string;
        };
        secondary: {
            hex: string;
            usage: string;
            meaning: string;
        };
    };
}

export interface ColorResponse {
    palettes: ColorPalette[];
}

export type FormData = z.infer<typeof updateFormSchemaForDefaultTypes>;