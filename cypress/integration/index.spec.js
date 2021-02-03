/// <reference types="Cypress" />

describe('Home Page', () => {
    const ROUTE_SELECT = '#select-route'
    const ROUTE_SELECT_ALIAS = '@routeSelect'
    const DIRECTION_SELECT = '#select-direction'
    const DIRECTION_SELECT_ALIAS = '@directionSelect'
    const ROUTE_ID = '901'
    const DIRECTION = '1'

    const selectFirstRoute = () =>
        cy.get(ROUTE_SELECT)
            .as(ROUTE_SELECT_ALIAS.substring(1))
            .get('option:eq(1)')
            .then(($option) => {
                const value = $option.val()
                cy.intercept(`/_next/data/**/${value}.json`)
                    .as('getDirections')
                cy.get(ROUTE_SELECT_ALIAS)
                    .select(value)
            })
    
    const selectFirstDirection = () =>
        cy.get(DIRECTION_SELECT)
            .as(DIRECTION_SELECT_ALIAS.substring(1))
            .find('option:eq(1)')
            .then(($option) => {
                const value = $option.val()
                cy.intercept(`/_next/data/**/${value}.json`)
                    .as('getStops')
                cy.get(DIRECTION_SELECT_ALIAS)
                    .select(value)
            })

    it('Loads', () => {
        cy.visit('/')
    })

    it('Displays, enables, and loads routes into the route selector', () => {
        cy.visit('/')

        cy.get(ROUTE_SELECT)
            .should('be.visible')
            .should('be.enabled')
            .should('have.value', '')
            .children()
            .then(($options) => {
                expect($options.length).to.be.greaterThan(1)
            })
    })

    it('Displays, enables, and loads directions into the direction selector', () => {
        cy.visit('/')
        selectFirstRoute()
        
        cy.wait('@getDirections')
        
        cy.get(DIRECTION_SELECT)
            .should('be.visible')
            .should('be.enabled')
            .should('have.value', '')
            .find('option:eq(1)')
            .then(($option) => {
                // Get 2nd option, as $select.children() happens before
                // new child options are rendered
                expect($option.length).to.eq(1)
            })
    })

    it('Displays stops', () => {
        cy.visit('/')
        selectFirstRoute()
        cy.wait('@getDirections')
        selectFirstDirection()

        cy.wait('@getStops')
            .get('section')
            .as('stopsSection')
            .should('be.visible')

        cy.get(ROUTE_SELECT_ALIAS)
            .then(($el) => $el.find(`option[value=${$el.val()}]`).text())
            .then(routeText =>
                cy.get(DIRECTION_SELECT_ALIAS)
                    .then(($el) => {
                        const directionText = $el.find(`option[value=${$el.val()}]`).text()
                        return { routeText, directionText }
                    })
            )
            .then(({ routeText, directionText }) => {
                cy.get('h2')
                    .then(($h2) => {
                        expect($h2).to.contain(routeText)
                        expect($h2).to.contain(directionText)
                    })
            })

        cy.get('@stopsSection')
            .get('li')
            .then(($lis) => {
                expect($lis.length).to.be.greaterThan(0)
            })
    })

    it('Updates the URL path upon selecting a route', () => {
        cy.visit('/')
        selectFirstRoute()
        cy.wait('@getDirections')
        
        cy.get(ROUTE_SELECT_ALIAS).then(($el) => $el.val())
            .then(selectedRoute => {
                cy.location('pathname').should('eq', `/${selectedRoute}`)
            })
    })

    it('Updates the URL path upon selecting a direction', () => {
        cy.visit('/')
        selectFirstRoute()
        cy.wait('@getDirections')
        selectFirstDirection()
        cy.wait('@getStops')
        
        cy.get(ROUTE_SELECT_ALIAS).then(($el) => $el.val())
            .then(selectedRoute =>
                cy.get(DIRECTION_SELECT_ALIAS).then(($el => ({
                    selectedRoute,
                    selectedDirection: $el.val()
                })))
            )
            .then(({ selectedRoute, selectedDirection }) => {
                cy.location('pathname')
                    .should('eq', `/${selectedRoute}/${selectedDirection}`)
            })
    })

    it('Navigates directly to a selected route', () => {
        cy.visit('/' + ROUTE_ID)

        cy.get(ROUTE_SELECT)
            .then(($el) => {
                expect($el.val()).to.eq(ROUTE_ID)
            })
        cy.get(DIRECTION_SELECT)
            .children()
            .its('length')
            .should('be.greaterThan', 1)
    })

    it('Navigates directly to a selected route + direction', () => {
        cy.visit(`/${ROUTE_ID}/${DIRECTION}`)

        cy.get(ROUTE_SELECT)
            .then(($el) => {
                expect($el.val()).to.eq(ROUTE_ID)
            })
        cy.get(DIRECTION_SELECT)
            .then(($el) => {
                expect($el.val()).to.eq(DIRECTION)
            })
        
        cy.get('section li')
            .its('length')
            .should('be.greaterThan', 0)
    })

    it('Correctly handles back and forward buttons', () => {
        const PATH1 = '/' + ROUTE_ID
        const PATH2 = `/${ROUTE_ID}/${DIRECTION}`
        cy.visit(PATH1)
        cy.visit(PATH2)
        cy.go('back')
            .get(ROUTE_SELECT)
            .as(ROUTE_SELECT_ALIAS.substring(1))
            .should(($el) => {
                expect($el.val()).to.eq(ROUTE_ID)
            })
            .get(DIRECTION_SELECT)
            .as(DIRECTION_SELECT_ALIAS.substring(1))
            .should(($el) => {
                expect($el.val()).to.eq('')
            })
            .location('pathname')
            .then((pathname) => {
                expect(pathname).to.eq(PATH1)
            })
        
        cy.go('forward')
            .get(ROUTE_SELECT_ALIAS)
            .should(($el) => {
                expect($el.val()).to.eq(ROUTE_ID)
            })
            .get(DIRECTION_SELECT_ALIAS)
            .should(($el) => {
                expect($el.val()).to.eq(DIRECTION)
            })
            .location()
            .its('pathname')
            .should('eq', PATH2)
    })
})