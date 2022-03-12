describe('pages', () => {
    const username = 'john@doe.se'
    const password = 'johndoe'

    beforeEach(() => {
        cy.loginByForm(username, password)
    })

    it('should visit pages index', () => {
        cy.visit('/admin/pages')
        cy.isPage('Pages');
    })

    it('should create a page template with two sections', () => {
        cy.visit('/admin/pages')

        cy.get('.page__header').get('a').contains('Page templates').click()
        cy.isPage('Page template')

        cy.get('.page__header').get('a').contains('Add page template').click()
        cy.isPage('Add page template')

        cy.get('[name=name]').type('Default')

        cy.get('button').contains('Add section').click()
        cy.get('[name="sections.0.name"]').type('Hero')
        cy.get('[name="sections.0.key"]').should('have.value', 'hero')

        cy.get('button').contains('Add column').click()
        cy.get('button').contains('Add column').click()

        cy.get('button').contains('Add section').click()
        cy.get('[name="sections.1.name"]').type('Main')
        cy.get('[name="sections.1.key"]').should('have.value', 'main')

        cy.get('.page-card').eq(1).contains('Add column').click()

        cy.get('button').contains('Save').click()

        cy.visit('/admin/pages/create/0')
        cy.get('[name=template]').select('Default')

        cy.get('.content-editor__section').eq(0)
            .should('contain', 'Hero')
            .find('.content-editor__column')
            .should('have.length', 2)

        cy.get('.content-editor__section').eq(1)
            .should('contain', 'Main')
            .find('.content-editor__column')
            .should('have.length', 1)
    })

    it('should create new hidden root page', () => {
        cy.visit('/admin/pages')
        cy.contains('Add root page').click()
        cy.contains('Add page')

        cy.get('[name=name]').type('Second start')
        cy.get('[name=template]').select('Start')
        cy.get('[name=isRoot]').check()
        cy.get('button').contains('Publish').click()

        cy.visit('/admin/pages')
        cy.get('.page-tree__leaf__label')
            .children()
            .should('contain', 'Second start')
            .and('contain', 'Root')
            .and('contain', 'Hidden')
    })

    it('should add content to root page and move it', { scrollBehavior: false }, () => {
        cy.visit('/admin/pages/1')
        cy.isPage('Edit page')
        cy.get('[name=name]').should('have.value', 'Start')

        cy.get('button').contains(/Add content/).click()
        cy.dragAndDrop('[data-rbd-draggable-id=text]', '[data-rbd-droppable-id="0-0"]')
        cy.get('.drawer__close').click()

        cy.get('[data-rbd-droppable-id="0-0"]').contains('Text')

        cy.dragAndDrop('[data-rbd-droppable-id="0-0"] .content-editor__block__header', '[data-rbd-droppable-id="0-1"]')

        cy.get('[data-rbd-droppable-id="0-0"]').contains('Text').should('not.exist')
        cy.get('[data-rbd-droppable-id="0-1"]').contains('Text')
    })

    it('should add a card template and insert it to root page', { scrollBehavior: false }, () => {
        // add card template
        cy.visit('/admin/pages')

        cy.get('.page__header').get('a').contains('Card templates').click()
        cy.isPage('Card templates')

        cy.get('.page__header').get('a').contains('Add card template').click()
        cy.isPage('Add card template')

        cy.get('[name=name]').type('Card')
        cy.get('[name=key]').should('have.value', 'card')

        cy.get('button').contains('Add field').click()

        cy.get('[name="fields.0.type"]').select('Text')
        cy.get('[name="fields.0.label"]').type('Label')
        cy.get('[name="fields.0.id"]').should('have.value', 'label')

        cy.scrollTo('bottom')
        cy.get('button').contains('Save').click()

        // add card
        cy.visit('/admin/pages/1')
        cy.isPage('Edit page')

        cy.get('button').contains(/Add content/).click()
        cy.get('.drawer__body').scrollTo('bottom')
        cy.get('.drawer__body').contains('Layout').click()
        cy.get('.drawer__body').scrollTo('bottom')

        cy.dragAndDrop('[data-rbd-draggable-id=card]', '[data-rbd-droppable-id="0-0"]')
        cy.get('.drawer__close').click()

        cy.get('[data-rbd-droppable-id="0-0"]').contains('Card')
        cy.get('[data-rbd-droppable-id="0-0"] .content-editor__block__actions [data-icon=edit]').click()

        cy.get('.drawer__header').contains('Edit card block')

        cy.get('.drawer [name=template]').select('Card')

        cy.get('.drawer [name=label]').type('Lorem ipsum')
        cy.get('.drawer button').contains('Save and close').click()

        cy.scrollTo('bottom')

        cy.get('[data-rbd-droppable-id="0-0"] .content-editor__block__body [data-icon=sliders-v-square]').click()

        cy.get('[data-rbd-droppable-id="0-0"] .content-editor__block__body').contains('Lorem ipsum')


    })
})
