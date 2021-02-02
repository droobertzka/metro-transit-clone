describe('Home Page', () => {
    // cy.intercept('/routes').as('getRoutes')

    it('Loads', () => {
        cy.visit('/')
    })

    it('Displays, enables, and loads routes into the route selector', () => {
        cy.visit('/')
        cy.get('#select-route')
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
        cy.get('#select-route')
            .as('routeSelect')
            .get('option:eq(1)')
            .then(($option) => {
                const value = $option.val()
                cy.intercept(`/_next/data/**/${value}.json`)
                    .as('getDirections')
                cy.get('@routeSelect')
                    .select(value)
            })
        
        cy.wait('@getDirections')
            .get('#select-direction')
            .should('be.visible')
            .should('be.enabled')
            .should('have.value', '')
            .find('option:eq(1)') // Get 2nd option
            .then(($option) => {
                expect($option.length).to.equal(1)
                expect($option.val()).not.to.equal('')
            })
    })

    it('Displays stops', () => {
        cy.visit('/')
        cy.get('#select-route')
            .as('routeSelect')
            .find('option:eq(1)')
            .then(($option) => {
                const value = $option.val()
                cy.intercept(`/_next/data/**/${value}.json`)
                    .as('getDirections')
                cy.get('@routeSelect')
                    .select(value)
            })
        
        cy.wait('@getDirections')
            .get('#select-direction')
            .as('directionSelect')
            .find('option:eq(1)') // Get 2nd option
            .then(($option) => {
                const value = $option.val()
                cy.intercept(`/_next/data/**/${value}.json`)
                    .as('getStops')
                cy.get('@directionSelect')
                    .select(value)
            })

        cy.wait('@getStops')
            .get('section')
            .as('stopsSection')
            .should('be.visible')

        cy.get('@routeSelect')
            .then(($el) => $el.find(`option[value=${$el.val()}]`).text())
            .then(routeText =>
                cy.get('@directionSelect')
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
})