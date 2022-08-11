export default Object.freeze({
    PORT: process.env.PORT || 1337,
    HOST: process.env.HOST || "0.0.0.0",
    DATABASE: {
        URL: "https://crhqywhiclgkpiblerkf.supabase.co",
        KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyaHF5d2hpY2xna3BpYmxlcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY1MjczMTgsImV4cCI6MTk3MjEwMzMxOH0.p8_SEs-jFbxXmr55o9sN9fc1x8GWjsrxMo7NhQK7QGI",
        TABLE: "bans"
    }
});
