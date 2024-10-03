const React = require('react');;
const { render, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');
const Input = require('./frontend/components/InputPrueba');

describe('Input Component', () => {
  test('should render an input with the correct type and placeholder', () => {
    const type = 'text';
    const placeholder = 'Enter text';

    render(React.createElement(Input, { type, placeholder }));

    const inputElement = screen.getByPlaceholderText(placeholder);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.getAttribute('type')).toBe(type);
    expect(inputElement.getAttribute('placeholder')).toBe(placeholder);
  });
});


