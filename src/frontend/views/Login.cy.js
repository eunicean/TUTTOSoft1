import React from 'react';
import Login from './Login.js';
import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';

describe('Login Component', () => {
  it('shows an error message with invalid credentials', () => {
    mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    cy.get('input[type="email"]').type('josep@uvg.edu.gt');
    cy.get('input[type="password"]').type('hash1');
    cy.wait(1000);  // Wait for half a second
    cy.get('button[type="submit"]').debug().click();  // Debug to inspect the button
    cy.get('.messages--error').should('be.visible').and('contain', 'Login failed:');
  });
});
