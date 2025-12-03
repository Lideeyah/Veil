const sharedConfig = require("@veil/config/tailwind.config.js");

module.exports = {
    ...sharedConfig,
    content: [
        ...sharedConfig.content,
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        ...sharedConfig.theme,
        extend: {
            ...sharedConfig.theme.extend,
            fontFamily: {
                sans: ["var(--font-sans)"],
                heading: ["var(--font-heading)"],
            },
        },
    },
};
