require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');
const { resume, selfDescription, jobDescription } = require('./src/services/temp');
const { generateInterviewReport } = require('./src/services/ai.service');

async function startServer() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // const report = await generateInterviewReport({
    //   resume,
    //   selfDescription,
    //   jobDescription
    // });

    // console.log("Generated Interview Report:", report);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();