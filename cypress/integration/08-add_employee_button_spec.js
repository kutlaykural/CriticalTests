describe('Add Employees button', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    it('Click on Add Employees, then Add single employee. It should take you to the section where you can add an individual employee profile.', function () {

        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('[class="btn btn-primary btn-lg btn-labeled fa fa-plus js-add-employee-trigger dropdown-toggle ember-view"]').click()//click on "Add Employees button" it opens add employee option list 
        cy.get('[class="js-add-employee-dropdown dropdown-menu ember-view"] li').contains("Add single employee").click()//select "Add single employee" option
        cy.url().should('contain', 'employees/create')//it should bring you to profile editing page
        cy.addEmployee("/cypress/fixtures/employee.json", 10)//add employee with prepared file
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//employee successfully created 
        cy.url().should('contain', 'profile')//it should bring you to profile editing page

    })

    it('Click on Add Employees, then Import by excel. It should take you to the section with the 2-step Excel upload process', function () {

        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('[class="btn btn-primary btn-lg btn-labeled fa fa-plus js-add-employee-trigger dropdown-toggle ember-view"]').click()//click on "Add Employees button" it opens add employee option list 
        cy.get('[class="js-add-employee-dropdown dropdown-menu ember-view"] li').contains("Import by excel").click()//select "import by excel" option             
        cy.get('[class="btn btn-default btn-lg btn-labeled fa fa-paper-plane mar-ver btn-primary ember-view"]').click({ force: true })//click "upload excel" button it will open file select dialog

    })

    it('Click on Add Employees, then Send email invites. It should take you to email invitations section', function () {

        cy.visit('/enterprise/dashboard/employees/list')
        cy.get('[class="btn btn-primary btn-lg btn-labeled fa fa-plus js-add-employee-trigger dropdown-toggle ember-view"]').click()//click on "Add Employees button" it opens add employee option list   
        cy.get('[class="js-add-employee-dropdown dropdown-menu ember-view"] li').contains("Send email invites").click()//select "send email invites" option
        cy.url().should('contain', '/invitations/create')//it should bring you to invitation create page
    })

})