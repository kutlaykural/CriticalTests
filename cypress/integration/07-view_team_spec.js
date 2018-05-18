describe('View Team', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
        cy.addEmployee("/cypress/fixtures/employee.json", 10)//with Create two other employee, birthdays anniversaries in the next 30 days
        cy.addEmployee("/cypress/fixtures/employee.json", 10)//with Create two other employee, birthdays anniversaries in the next 30 days
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    it('You should be able to select one or more employees, the red bin button and invite button should then appear', function () {

        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('tbody [class="fa fa-square-o"]', { timeout: 20000 }).first().click()//select first element of the table
        cy.get('button[class="btn btn-lg btn-icon btn-danger ember-view"]').should('be.visible')//now red bin button should be visible
        cy.get('button[class="btn-jungle-green  btn btn-lg mar-rgt--xs btn-default ember-view"]').should('be.visible')//and invite button should be visible too
    })

    it('You should see a percentage number for each record under Profile Completion', function () {

        cy.contains("Profile Completion")//table should has a column header with "Profile Completion" name 
        cy.get('tbody [class="text-center hidden-xs"]', { timeout: 20000 }).should('contain', '%', { multiple: true })//table records should have percentage value
    })

    it('Try to delete one employee, you should get a success message', function () {

        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('tbody > :nth-child(1) > [data-ember-action=""] > .fa', { timeout: 20000 }).click()//select element at first row
        cy.get('button[class="btn btn-lg btn-icon btn-danger ember-view"]').click()// click red bin button to delete row
        cy.get('.modal-content').contains("Delete").click()//confirm deleting
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//row should be successuly deleted 
    })

    it('You should be able to search for an employee by first or last name, the list would be filtered by that employee only', function () {

        cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
            cy.get('input[type="search"]', { timeout: 20000 }).type(employeeJSON.firstName)//type search box employee's firstname
            cy.get('tbody [class="cell-ellipsis--mobile"]', { timeout: 20000 }).should('contain', employeeJSON.firstName, { multiple: true })//now there should be exists the employee
        })
    })

    it('Clicking on Edit should take you to that employee’s profile', function () {

        cy.get(':nth-child(1) > :nth-child(7) > .btn > .fa', { timeout: 20000 }).first().click({ force: true })//click first rows edit button
        cy.get('.bg--athens-gray > :nth-child(2) > div', { timeout: 20000 })// it should bring you to profile editing page- wait for page load with tab navigator  

    })

    it('Click "Filter By" and try a couple of filters (expired documents and terminated status are easy ones to figure out if they’re working)', function () {

        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('button[type="button"].filter__trigger', { timeout: 20000 }).click()//open filter menu
        cy.get('.filter__menu > .row.filter__row:nth-of-type(7) > .filter__list.list-inline > .filter__item:nth-of-type(3) > i.fa.filter__item-icon.fa-square-o')
            .click()//status- Terminated
        cy.get('.filter__menu > .row.filter__row:nth-of-type(4) > .filter__list.list-inline > .filter__item:nth-of-type(2) > i.fa.filter__item-icon.fa-square-o')
            .click()// expired document - Residency Visa
        cy.get('button[type="button"].btn.filter__submit').click()// apply filter
        cy.contains('li', 'Status')//now "status" filter should be implemented
        cy.contains('li', 'Expired Documents')//also "expired document" filter should be implemented
    })

    it('Click Export Data (download button next to the search bar), it should take you to the 2-step excel import page)', function () {

        cy.get('[class="btn btn-default btn-lg btn-icon btn-link ember-view"]').click()//click "export data" button
        cy.get('[class=" btn btn-lg btn-labeled fa fa-download mar-ver btn-secondary ember-view"]').click()//click download button
        cy.get('[class="modal fade in ember-view"]').contains("I got it!").click({ force: true })//click 'I got it' on confirmation popup 
    })

    it('Click on Invite button against the person’s name to send them invitation directly,make sure to enter a valid email', function () {
        //Test updated//old test: 'make sure to enter correct email id and insurance plan'
        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('tbody [class="btn btn-xs btn-jungle-green btn-rounded pad-hor--xs btn-default ember-view"]').first().click()//click to "invite" button
        cy.get('[class="form-group mar-no is-required js-property-email-work ember-view"]').first().should('contain', '@')//there should be a valid email address in popup 
        cy.get('.btn-secondary').click() //click send invitation
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//invitation should be send successfully
    })
})