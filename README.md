# XG Tech Recruiter API

A Node.js/Express API service for CV analysis and job matching using OpenAI's agents framework, optimized for Render deployment.

## 🚀 Features

- **CV Analysis**: Analyzes candidate CVs and matches them to job requirements
- **RESTful API**: Clean REST endpoints for integration
- **Error Handling**: Comprehensive error handling and logging
- **Health Checks**: Built-in health monitoring
- **Render Ready**: Pre-configured for Render deployment

## 📋 Prerequisites

- Node.js 18+
- OpenAI API key
- Render account (for deployment)

## 🛠️ Local Development

1. **Clone and setup:**
```bash
git clone <your-repo>
cd xg-tech-recruiter-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🌐 API Endpoints

### `GET /`
API information and available endpoints

### `GET /health`
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### `POST /analyze`
Analyze CV and match to jobs

**Request:**
```json
{
  "input_as_text": "John Doe - Software Engineer with 5 years experience in React and Node.js..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "output_text": "Analysis results..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Render Deployment

### Automatic Deployment
1. Push your code to a Git repository
2. Connect your repo to Render
3. Render will automatically detect and deploy using `render.yaml`

### Manual Deployment
1. Create a new Web Service on Render
2. Connect your Git repository
3. Set environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
4. Deploy!

### Required Environment Variables on Render
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NODE_ENV`: Set to `production`
- `PORT`: Render automatically sets this to `10000`

## 📦 Project Structure

```
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── render.yaml           # Render deployment configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🔧 Configuration

The agent uses:
- **Model**: GPT-4
- **Temperature**: 1.0
- **Max Tokens**: 2048
- **Tools**: File search for document analysis

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Ensure your API key is valid and has sufficient credits
   - Check that the environment variable is set correctly

2. **Deployment Failures**
   - Verify `package.json` has correct start script
   - Check that all dependencies are properly listed
   - Ensure `render.yaml` is in the root directory

3. **Memory Issues**
   - Monitor your usage and consider upgrading Render plan if needed
   - Implement request rate limiting for production

## 📊 Monitoring

Render provides built-in monitoring:
- Response times
- Error rates
- Resource usage
- Custom metrics via `/health` endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
