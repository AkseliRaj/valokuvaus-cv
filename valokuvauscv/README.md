# Photography Portfolio

A beautiful React photography portfolio with a fluid masonry grid layout and infinite scrolling, inspired by Pinterest and Public Work by Cosmos.

## Features

- **Fluid Masonry Grid**: Photos are arranged in a responsive grid that adapts to different screen sizes
- **Infinite Scrolling**: Automatically loads more photos as you scroll down
- **Smooth Animations**: Hover effects and smooth transitions for an engaging user experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, modern design with gradient backgrounds and glass-morphism effects

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Customizing Your Portfolio

### Adding Your Own Photos

1. **Replace Sample Photos**: In `src/App.js`, replace the `samplePhotos` array with your own photography data:

```javascript
const samplePhotos = [
  {
    id: 1,
    src: '/path/to/your/photo1.jpg',
    alt: 'Description of your photo',
    title: 'Your Photo Title',
    description: 'Description of your photography work'
  },
  // Add more photos...
];
```

2. **Photo Requirements**:
   - Use high-quality images (recommended: 800px-1200px width)
   - Include descriptive alt text for accessibility
   - Add meaningful titles and descriptions
   - Supported formats: JPG, PNG, WebP

### Styling Customization

- **Colors**: Modify the gradient colors in `src/App.css` (lines 15-16)
- **Grid Layout**: Adjust the `breakpointColumns` object in `src/App.js` to change responsive breakpoints
- **Animations**: Customize animation timings and effects in `src/App.css`

### Performance Optimization

- **Image Optimization**: Use compressed images and consider using WebP format
- **Lazy Loading**: Images are automatically lazy-loaded for better performance
- **Infinite Scroll**: Photos load in batches to maintain smooth scrolling

## Project Structure

```
src/
├── App.js          # Main component with masonry grid and infinite scroll
├── App.css         # Styles for the portfolio layout and animations
├── index.js        # React app entry point
└── index.css       # Global styles
```

## Technologies Used

- **React**: Frontend framework
- **react-masonry-css**: For the fluid grid layout
- **CSS3**: For animations and responsive design
- **Unsplash API**: For sample images (replace with your own)

## Deployment

To build the app for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that you can deploy to any static hosting service like:

- Netlify
- Vercel
- GitHub Pages
- AWS S3

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: Replace the sample Unsplash images with your own photography work to create your personal portfolio. The current setup uses placeholder images for demonstration purposes.
