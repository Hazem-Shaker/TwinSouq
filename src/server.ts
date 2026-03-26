import appFactory from "./app"; // Import the app factory function

// Create the app with a configuration object (e.g., isProd)
const app = appFactory();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
