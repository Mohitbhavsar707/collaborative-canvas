# Collaborative Drawing Canvas

A simple web-based collaborative drawing application that allows multiple users to draw, add text, and paste images on a shared canvas.

## Features

🎨 **Drawing Tools**
- Draw with customizable brush size (1-50px)
- Choose any color with the color picker
- Eraser tool for corrections
- Smooth drawing experience with touch support

📝 **Text Tool**
- Click anywhere on canvas to add text
- Adjustable font size (12-72px)
- Uses the selected color for text

🖼️ **Image Support**
- Upload images via file picker
- Paste images directly with Ctrl+V (Cmd+V on Mac)
- Images are automatically scaled to fit reasonably on canvas

💾 **Collaborative Saving**
- Auto-saves every 30 seconds
- Manual save/load buttons
- Shows who last edited and when
- Uses browser localStorage for persistence

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface for mobile drawing

## How to Use

1. **Open the app**: Open `index.html` in any modern web browser
2. **Enter your name**: Add your name in the header so others know who made edits
3. **Choose a tool**: Select Draw, Erase, or Text from the toolbar
4. **Customize settings**: Adjust color, brush size, or font size as needed
5. **Create**: Draw, add text, or paste/upload images
6. **Save**: Your work auto-saves, or click Save for immediate saving
7. **Collaborate**: Other users can load your work and add to it

## Tools Overview

### Drawing Tool ✏️
- Default tool for freehand drawing
- Drag to draw continuous lines
- Uses selected color and brush size

### Eraser Tool 🧽
- Remove parts of your drawing
- Size controlled by brush size slider
- Works by making areas transparent

### Text Tool 📝
- Click on canvas to place text
- Type your text and press Enter or click ✓
- Uses selected color and font size

### Actions
- **🗑️ Clear**: Removes everything from canvas (with confirmation)
- **💾 Save**: Manually saves current canvas state
- **📁 Load**: Loads the most recent saved version

## Technical Details

- **Frontend**: HTML5 Canvas, CSS3, Vanilla JavaScript
- **Storage**: Browser localStorage (shared across tabs)
- **Compatibility**: Modern browsers with Canvas support
- **No server required**: Runs entirely in the browser

## File Structure

```
collaborative-canvas/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Limitations

- Uses localStorage, so collaboration is limited to the same browser/device
- For true multi-user collaboration, you'd need a backend server
- Canvas size is responsive but drawing quality depends on screen resolution

## Future Enhancements

Potential improvements for a production version:
- Real-time collaboration with WebSocket server
- More drawing tools (shapes, layers)
- Undo/redo functionality
- Export options (PNG, PDF)
- User authentication and persistent storage

---

**Enjoy creating and collaborating! 🎨**
