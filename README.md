# E-Voting System

A secure and user-friendly electronic voting system interface designed to facilitate democratic processes.

## Project Structure

```
e-voting-system/
├── assets/              # Static assets (images, icons)
├── css/                 # CSS files
│   ├── base/            # Base styles (variables, reset, typography)
│   ├── components/      # Component-specific styles (buttons, forms, etc.)
│   ├── layout/          # Layout styles (header, footer, grid)
│   ├── pages/           # Page-specific styles
│   └── styles.css       # Main CSS file that imports all others
├── js/                  # JavaScript files
│   ├── components/      # UI components
│   │   ├── forms.js     # Form handling and validation
│   │   ├── ui.js        # UI manipulation and rendering
│   │   └── voting.js    # Voting-specific functionality
│   ├── services/        # Services for data and authentication
│   │   ├── api.js       # API communication
│   │   └── auth.js      # Authentication logic
│   ├── utils/           # Utility functions
│   │   └── helpers.js   # Helper functions
│   └── main.js          # Main entry point
└── index.html           # Main HTML file
```

## Features

- **User Authentication**: Secure login with multi-factor authentication
- **Voter Verification**: Three-step verification process (Voter ID, OTP, Biometric)
- **Voting Interface**: Intuitive interface for candidate selection
- **Review and Submit**: Review selections before final submission
- **Responsive Design**: Optimized for all devices

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Use the following credentials for testing:
   - Voter ID: 1234-5678-9012
   - OTP: 123456

## Technologies Used

- HTML5
- CSS3 with modern features (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

### CSS Naming Convention

We use a simplified BEM (Block Element Modifier) approach:
- `.block`: Represents a component
- `.block-element`: Represents a child of the component
- `.block--modifier`: Represents a variation of the component

### JavaScript Organization

- **Modules**: Each JavaScript file exports a module with related functionality
- **Event Delegation**: Used for optimal performance
- **Error Handling**: All API calls include proper error handling
- **Validation**: Client-side validation implemented for all forms

## License

[MIT License](LICENSE)

## Contact

For support or inquiries, please contact: support@evoting.com 