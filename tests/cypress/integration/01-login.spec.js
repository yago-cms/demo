describe('login', () => {
    const username = 'john@doe.se'
    const password = 'johndoe'

    context('unauthorized', () => {
        it('displays login form when not authenticated', () => {
            cy.visit('/admin/dashboard')

            cy.get('.login').contains('Login')
        });
    });

    context('login with form', () => {
        beforeEach(() => {
            cy.visit('/admin')
        })

        it('displays errors on login', () => {
            cy.get('input[name=email]').type('invalid@user.se')
            cy.get('input[name=password]').type('123{enter}')

            cy.get('.alert').contains('Could not login. Wrong e-mail and/or password.')
        });

        it('displays dashboard after login', () => {

            cy.get('input[name=email]').type(username)
            cy.get('input[name=password]').type(password)
            cy.get('button').contains('Login').click()

            cy.get('.page__heading').contains('Dashboard')
        });
    });

    context('procedurally log in', () => {
        beforeEach(() => {
            cy.loginByForm(username, password)
        })

        it('displays login form on logout', () => {
            cy.visit('/admin')

            cy.get('button').contains('Log out').click()

            cy.get('.login').contains('Login')

        })
    })
});