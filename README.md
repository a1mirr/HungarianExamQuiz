# 🇭🇺 Hungarian Exam Quiz Website

A beautiful, interactive quiz website for Hungarian cultural exam preparation with multilingual support (HU/EN/RU).

## ✨ Features

- 🌍 **Multilingual Support**: Switch between Hungarian, English, and Russian
- 📚 **6 Main Topics**: National Symbols, History, Literature & Art, Constitution, Rights & Obligations, Geography & Culture
- 🎴 **Interactive Flip Cards**: Click to reveal answers
- 📊 **Progress Tracking**: See your progress through each topic
- 🎨 **Modern Design**: Beautiful glassmorphism UI with smooth animations
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Option 1: Open Locally

1. Simply open `index.html` in your web browser
2. The website runs entirely in your browser - no server needed!

### Option 2: Deploy to GitHub Pages

1. **Create a GitHub repository**:
   ```bash
   cd "c:\Hungarian exam"
   git init
   git add docs/
   git commit -m "Add Hungarian exam quiz website"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your local repository

3. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Choose `main` branch and `/docs` folder
   - Click Save

4. **Access your website**:
   - Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`
   - It may take a few minutes for the first deployment

## 📖 How to Use

1. **Select Language**: Click the language button (🇬🇧 EN / 🇷🇺 RU / 🇭🇺 HU) in the top-right corner
2. **Choose a Topic**: Click on any topic card to start
3. **Study Questions**: 
   - Read the question in Hungarian
   - Click the "Show Answer" button to reveal the answer
   - Use "Previous" and "Next" buttons to navigate
4. **Track Progress**: Watch the progress bar to see how many questions you've completed

## 🗂️ Project Structure

```
docs/
├── index.html          # Main HTML file
├── styles.css          # Premium CSS with glassmorphism design
├── app.js             # JavaScript application logic
└── data/
    ├── topics.json    # Topic index with icons and names
    ├── topic1.json    # National Symbols & Holidays
    ├── topic2.json    # History
    ├── topic3.json    # Literature & Art
    ├── topic4.json    # Constitution
    ├── topic5.json    # Rights & Obligations
    └── topic6.json    # Geography & Culture
```

## 🎨 Design Features

- **Glassmorphism Effects**: Modern frosted-glass UI elements
- **Smooth Animations**: Fade-in, slide, and flip animations
- **Dark Theme**: Easy on the eyes with vibrant accent colors
- **Responsive Layout**: Adapts beautifully to any screen size
- **Premium Typography**: Using Inter font for clean readability

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern features including CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks - fast and lightweight
- **Google Fonts**: Inter font family

## 📊 Question Types

The quiz supports multiple question formats:
- **Open Questions**: Free-form answers
- **Multiple Choice**: Select correct options
- All questions include Hungarian text with translations

## 🌐 Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 💡 Tips

- Your language preference is saved automatically
- Questions are loaded dynamically for optimal performance
- The website works offline once loaded
- Perfect for studying on the go!

## 📝 Data Source

All questions are sourced from the official Hungarian cultural exam materials and have been translated into English and Russian.

## 🤝 Contributing

Feel free to add more questions or improve translations:
1. Edit the JSON files in the `data/` folder
2. Follow the existing format
3. Test locally before deploying

## 📄 License

Educational use only. All exam content is property of the Hungarian government.

---

Made with ❤️ for Hungarian exam preparation
