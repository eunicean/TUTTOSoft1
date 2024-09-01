const React = require('react');

function Input({ type, placeholder }) {
    return React.createElement('input', { type: type, placeholder: placeholder });
}

module.exports = Input;

