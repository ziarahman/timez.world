# Worldtimez 🌍

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5.x-blue)](https://mui.com/)

Worldtimez is a modern, user-friendly timezone comparison application built with React and Material-UI. It allows users to easily compare times across different timezones with an intuitive drag-and-drop interface.

## ✨ Features

- 🕒 Compare multiple timezones simultaneously
- 📅 Set specific date & time to compare
- 🔄 Drag-and-drop interface for reordering timezones
- 🌓 Dark/Light mode support
- 📱 Responsive design for all devices
- 🔍 Smart timezone search with city suggestions
- 💾 Persistent storage of user preferences
- ⚡ Fast and efficient time conversions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ziarahman/worldtimez.git
cd worldtimez
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:4242](http://localhost:4242) in your browser

## 🏗️ Production Deployment

### Building for Production

1. Create a production build:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t worldtimez .
```

2. Run the container:
```bash
docker run -p 4242:4242 worldtimez
```

## 🛠️ Tech Stack

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Material-UI](https://mui.com/) - Component Library
- [Luxon](https://moment.github.io/luxon/) - DateTime Handling
- [@dnd-kit](https://dndkit.com/) - Drag and Drop
- [Vite](https://vitejs.dev/) - Build Tool

## 📦 Project Structure

```
worldtimez/
├── src/
│   ├── components/        # React components
│   ├── data/             # Timezone data and utilities
│   ├── lib/              # Helper functions
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── server.js            # Production server
└── package.json         # Project dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Timezone Database](https://timezonedb.com/) for timezone data
- [Material-UI](https://mui.com/) for the beautiful components
- [@dnd-kit](https://dndkit.com/) for the drag and drop functionality

## 🔗 Links

- [Live Demo](https://worldtimez.vercel.app)
- [Documentation](https://github.com/ziarahman/worldtimez/wiki)
- [Issue Tracker](https://github.com/ziarahman/worldtimez/issues)

---

Made with ❤️ by [Zia Rahman](https://github.com/ziarahman) + [Vibe Coding](https://en.wikipedia.org/wiki/Vibe_coding) with AI 🤖 using [Windsurf](https://windsurf.ai).
