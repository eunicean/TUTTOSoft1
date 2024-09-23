describe('Login functionality', () => {
    it('should display an error message when login fails', () => {
      cy.visit('/'); // Adjust the path as needed
      cy.get('input[type="email"]').type('invalid-email@uvg.edu.gt');
      cy.get('input[type="password"]').type('wrong-password');
      cy.get('button[type="submit"]').click();
      cy.get('#container') // Adjust the selector based on your actual error message container
        .should('contain', 'Login failed: Invalid credentials');
    });
  });
  