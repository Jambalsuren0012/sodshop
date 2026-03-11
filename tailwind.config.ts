/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Mongolian', 'Roboto', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#1E3A8A', // Гүн хөх
        secondary: '#2563EB', // Илүү цайвар хөх
        accent: '#F59E0B', // Алтан шаргал
        neutral: '#F3F4F6', // Light gray background
        base: '#111827', // Dark base text
        success: '#10B981', // Амжилттай action
        error: '#EF4444', // Алдаа
      },
    },
  },
  plugins: [],
};
