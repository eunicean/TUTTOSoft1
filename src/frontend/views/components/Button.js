import React from 'react';

const buttonStyle = {
  backgroundColor: '#8E6B3A ', /* Color chocolate claro */
  color: 'white', /* Texto blanco */
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const hoverStyle = {
  backgroundColor: '#C17C44', /* Un poco más oscuro en hover */
};

const activeStyle = {
  backgroundColor: '#A0522D', /* Más oscuro cuando se presiona */
};

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isActive: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleMouseDown = () => {
    this.setState({ isActive: true });
  };

  handleMouseUp = () => {
    this.setState({ isActive: false });
  };

  render() {
    const { onClick, children } = this.props;
    const { isHovered, isActive } = this.state;
    let currentStyle = { ...buttonStyle };

    if (isHovered) {
      currentStyle = { ...currentStyle, ...hoverStyle };
    }

    if (isActive) {
      currentStyle = { ...currentStyle, ...activeStyle };
    }

    return (
      <button
        style={currentStyle}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        {children}
      </button>
    );
  }
}

export default Button;

