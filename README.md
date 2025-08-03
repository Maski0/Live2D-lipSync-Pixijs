# Live2D Motion Sync with PixiJS

A React-based web application that demonstrates Live2D model integration with motion synchronization using PixiJS. This project showcases interactive Live2D characters with lip-sync capabilities and motion playback.

## ✨ Features

- **Live2D Model Display**: Render Live2D models using PixiJS
- **Motion Synchronization**: Lip-sync animation synchronized with audio playback
- **Multiple Model Support**: Display single or dual models simultaneously
- **Interactive Controls**: Play different motions and audio files
- **Multi-language Audio**: Support for English, Japanese, Korean, and Chinese audio
- **Responsive Design**: Built with Tailwind CSS and Ant Design components

## 🎭 Available Models

- **Kei**: Voice model with motion sync capabilities
- **Mao**: Character model with various motion animations
- **Hiyori**: Interactive character with gesture-based motions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Live2D-lpSync-Pixijs.git
cd Live2D-lpSync-Pixijs
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 Usage

### Single Model Demo
- Navigate to the home page to see the Kei model with lip-sync
- Select different audio files to hear various languages
- The model's mouth movements will sync with the audio

### Double Model Demo
- Click "Double Model Test" to see Mao and Hiyori models side by side
- Use the motion controls to trigger different animations:
  - **Mao**: Idle motions and special animations
  - **Hiyori**: Interactive gestures (Tap, Flick, Body interactions)

## 📁 Project Structure

```
src/
├── App.tsx              # Main application with routing
├── Live2DPage.tsx       # Single model demo (Kei with lip-sync)
├── DoubleLive2DPage.tsx # Dual model demo (Mao + Hiyori)
├── models.ts            # Model configurations and motion lists
└── main.tsx             # Application entry point

public/
├── models/              # Live2D model files
│   ├── kei_vowels_pro/  # Kei model with motion sync
│   ├── mao_pro/         # Mao model with expressions
│   └── hiyori_pro_en/   # Hiyori model with gestures
└── *.wav                # Audio files for lip-sync
```

## ��️ Technology Stack

- **React 18** - Frontend framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **PixiJS 6.5** - 2D rendering engine
- **pixi-live2d-display** - Live2D model integration
- **live2d-motionsync** - Motion synchronization
- **Ant Design** - UI components
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🎨 Live2D Models

### Kei Model
- **Purpose**: Lip-sync demonstration
- **Features**: Motion sync with audio, vowel recognition
- **Files**: Model, textures, motion sync data

### Mao Model  
- **Purpose**: Expression and motion showcase
- **Features**: Facial expressions, idle animations, special motions
- **Files**: Model, textures, expressions, physics

### Hiyori Model
- **Purpose**: Interactive gesture demonstration  
- **Features**: Touch interactions, gesture recognition, pose variations
- **Files**: Model, textures, motions, physics, poses

## 🔧 Configuration

### Adding New Models
1. Place your Live2D model files in `public/models/`
2. Update `src/models.ts` with the new model path
3. Add motion configurations if needed

### Adding New Audio
1. Place audio files in `public/`
2. Update the audio file list in the relevant component
3. Ensure motion sync files are properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source. Please check the individual Live2D model licenses for usage rights.

## 🙏 Acknowledgments

- Live2D Cubism SDK
- PixiJS community
- Live2D sample models for demonstration purposes
- pixi-live2d-display
- live2D-motionSync by [@liyao1520](https://github.com/liyao1520)



## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This project is for demonstration and educational purposes. Make sure to comply with Live2D's licensing terms when using their models and SDK.