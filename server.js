import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileSearchTool, Agent, TResponseInputItem, Runner, withTrace } from "@openai/agents";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Tool definitions
const fileSearch = fileSearchTool([
  "vs_69a417d221988191aadaa6918c8cc962"
]);

const agent = new Agent({
  name: "XG Tech Recruiter",
  instructions: `You are a professional recruiter and your job is to match the CV from user to the job available in XG Tech {{vs_69a417d221988191aadaa6918c8cc962}} according to the following criteria, not by sequence but by context.
1. If the job held by candidate in previous job does not match any of the job description, then the candidate is not suitable.
2. Consider only the relevant working experience and not the overall working experience.
Example : If a candidate worked as banker for 2 years and software programmer for 5 years, then his experience for software experience is 5.
Example : He started as junior programmer in C language and continue to become senior programmer in C++.
3. The candidate must at least match or exceed the years of experience required.
 
Pointers that you can highlight if candidate match the job requirements
- Highlight candidate who graduated from world top ranking university.
- Highlight candidate who graduated from university in Singapore and worked in Singapore is preferable.
- Highlight candidate who has consistently relevant work experience and skill.
 
Pointers that you want to give warning if candidates
- Changing job frequently over his working career as this is a sign of instability.
Example : If he changes job every 12 to 18 months.
- If candidate is from a lesser known university and unknown company`,
  model: "gpt-4",
  tools: [fileSearch],
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

// Main workflow function
const runWorkflow = async (workflow) => {
  return await withTrace("XG Tech Agent", async () => {
    const conversationHistory = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_69a42c5840ac8190a7db2ff6c00e2033081144f480e885ec"
      }
    });
    
    const agentResultTemp = await runner.run(agent, [...conversationHistory]);
    conversationHistory.push(...agentResultTemp.newItems.map((item) => item.rawItem));

    if (!agentResultTemp.finalOutput) {
      throw new Error("Agent result is undefined");
    }

    return {
      output_text: agentResultTemp.finalOutput ?? ""
    };
  });
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: "XG Tech Recruiter API",
    version: "1.0.0",
    endpoints: {
      "/": "API information",
      "/health": "Health check",
      "/analyze": "POST - Analyze CV and match to jobs"
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/analyze', async (req, res) => {
  try {
    const { input_as_text } = req.body;
    
    if (!input_as_text) {
      return res.status(400).json({
        error: 'Missing required field: input_as_text',
        message: 'Please provide CV text or job matching request'
      });
    }

    const result = await runWorkflow({ input_as_text });
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 XG Tech Recruiter API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 CV Analysis: http://localhost:${PORT}/analyze`);
});

export default app;
