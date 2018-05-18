describe('Add Employee', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    it('Click on Add Employees, then Add Employee, you should be at the section where you create an individual profile', function () {

        cy.visit('/enterprise/dashboard/')
        cy.contains("Add Employees").click()//click Add Employee button
        cy.contains("a", "Add Employee").click()//select "Add Employee" option on list
        cy.url().should('contain', 'employees/create')//it should bring you to profile editing page
        cy.addEmployee("/cypress/fixtures/employee.json", 10)//add employee with prepared file
        cy.url().should('contain', '/profile/personal')// the profile page should be ready
    })

    it('Fill out all the sections and hit Save, then make sure that the record was created', function () {

        cy.completeEmployeeInfo("/cypress/fixtures/employee(full).json")//fill all scopes on profile
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 20000 }).should('be.visible')//employee profile successfully filled

    })
})