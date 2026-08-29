/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Off-blacks — proprietary atmosphere (not #000)
        nova: {
          bg: "#0D1B2A",           // Dark navy — primary
          "bg-forest": "#0F1E0F",  // Deep forest — wellness
          "bg-elevated": "#132235",
          surface: "#151F2E",
          "surface-elevated": "#1A2738",
          "surface-inset": "#0F1926",
        },
        // Text — WCAG AAA compliant (7:1 body)
        "nova-text": {
          primary: "#FFFFFF",
          secondary: "#B8C5D6",
          muted: "#8B9AAD",
        },
        // Primary
        primary: {
          green: "#43A047",
          blue: "#1976D2",
          orange: "#FFA726",
          purple: "#7E57C2",
        },
        success: "#43A047",
        caution: "#FFA726",
        error: "#D32F2F",
        vitality: { DEFAULT: "#43A047", light: "#81C784", muted: "#C8E6C9" },
        trust: { DEFAULT: "#1976D2", light: "#64B5F6", muted: "#E3F2FD" },
        wellness: { DEFAULT: "#7E57C2", light: "#B39DDB", muted: "#EDE7F6" },
        energize: { red: "#D32F2F", coral: "#FF7043" },
      },
      // 8px baseline grid
      spacing: {
        0.5: "2px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
      },
      // Hard edges — Pro Tool aesthetic (0px or 4px)
      borderRadius: {
        none: "0px",
        nova: "4px",
        "nova-sm": "2px",
      },
      fontSize: {
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
        "4xl": ["32px", { lineHeight: "40px" }],
      },
      fontFamily: {
        heading: ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
    },
  },
  plugins: [],
};
