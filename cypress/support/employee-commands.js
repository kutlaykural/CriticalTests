// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.add('addEmployee', (fileName,birtdayAddToday) => {
    cy.visit('/enterprise/dashboard/employees/create')
    cy.get('.js-employee-add-form').should('be.visible') // add employee form should be visible	
    cy.get('form').within(($form) => {
        cy.readFile(fileName).then((employeeJSON) => {
            cy.get('input[name="firstName"]').type(employeeJSON.firstName)// first name
            cy.get('input[name="lastName"]').type(employeeJSON.lastName)// last name
            cy.get('input[name="emailWork"]').type('fake' + Math.random() * 100 + '@gmail.com')//Work Email
            cy.contains('Please select health insurance').click({ force: true })//select health insurance
            cy.contains(employeeJSON.plan).click({ force: true })
            cy.get('input[name="dateBirthFormatted"]')
                .type(Cypress.moment().add(birtdayAddToday, 'day').subtract(20,'year').format("DD/MM/YYYY"))//birtday
            cy.log(Cypress.moment().add(birtdayAddToday, 'day').subtract(20,'year').format("DD/MM/YYYY"))
                cy.get('input[name="hiredAtFormatted"]').type(employeeJSON.hireadDate)//hiredDate
            cy.get('[class="col-sm-9 col-sm-offset-3"] .fa ').click()
        })
        cy.contains('Create').click()
    })
    cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//employee successfully created 
})

Cypress.Commands.add('deleteAllEmployees', () => {

    cy.visit('/enterprise/dashboard/employees/list')
    cy.get('thead > tr > :nth-child(1) > .fa', { timeout: 20000 }).click()//check all employess
    cy.get('[class="table hovered-rows loader  js-employee-list"]').then(($body) => {//get employee  table body
        if ($body.text().includes('Select all')) {
            $body.find('button[class="btn btn--pad-no alert-link btn-link ember-view"]').click()
        }//else there is no "select all" button so number of row should be <= 10
    })    
    cy.get('button[class="btn btn-lg btn-icon btn-danger ember-view"]').click()//click delete button
    cy.get('.modal button[type="submit"]').click()//click delete again to confirm delete
    cy.get('.alert-message', { timeout: 20000 }).should('be.visible')//any type of alert acceptable(there 3 types 1- success 2- fail 3- success with exception )
})
Cypress.Commands.add('completeEmployeeInfo', (fileName) => {
    cy.get('[class="js-profile-form pad-top form-horizontal ember-view"]').within(($form) => {
        cy.readFile(fileName).then((employeeJSON) => {
            cy.get('input[name="preferredName"]').type(employeeJSON.preferredName)// preferredName
            cy.contains('Please select nationality').click({ force: true })//click on nationality dropdown and open its option list
            cy.get('.ember-power-select-search-input').type(employeeJSON.nationality, { force: true })//There is a bug while typing 'Turkish - Turkey'
            cy.contains(employeeJSON.nationality).click({ force: true })//select nationality
            cy.contains('Please select gender').click({ force: true })//click on gender dropdown and open its option list
            cy.contains(employeeJSON.gender).click({ force: true })//select gender
            cy.contains('Please select marital status').click({ force: true })//click on matial dropdown and open its option list
            cy.contains(employeeJSON.marital).click({ force: true }) //select marial status 
            cy.get('input[name="numberMobile"]').type(employeeJSON.numberMobile, { force: true })//mobile No
            cy.get('input[name="emailPersonal"]').type(employeeJSON.emailPersonal)//Personel Email*
            cy.get('input[name="numberOffice"]').type(employeeJSON.numberOffice, { force: true })//Work No *
            cy.get('[name="addressPersonal"]').type(employeeJSON.addressPersonel)//Personel Adress*
        })
        cy.contains('Save profile').click()
    })
})

Cypress.Commands.add('sendInvitation', (fileName) => {
    cy.get('form[class="clearfix js-invite-employee-form form ember-view"]').within(($form) => {
        cy.readFile(fileName).then((invitationJSON) => {
            cy.get('input[name="firstName"]').type(invitationJSON.firstName)//type invitation firstname 
            cy.get('input[name="lastName"]').type(invitationJSON.lastName)//type invitation lastname
            cy.contains('Health Insurance').click({ force: true })
            cy.get('.ember-power-select-option').click()
            cy.get('input[name="emailWork"]').type('fake' + Math.random() * 100 + '@gmail.com')//Work Email	
            cy.get('[name="message"]').type(invitationJSON.message)
            cy.get('[type="submit"]').click()
        })
    })

})

Cypress.Commands.add('sendTwoInvitations', (fileName) => {
    cy.readFile(fileName).then((invitationJSON) => {
        cy.get(':nth-child(3) > .js-invite-new-employee-item-form > .pad-ver--xs > .col-sm-11 > .row ', { timout: 20000 }).within(($form) => {
            cy.get(':nth-child(1) > .form-group > .ember-text-field').type(invitationJSON.firstName)
            cy.get(':nth-child(2) > .form-group > .ember-text-field').type(invitationJSON.lastName)
            cy.get(':nth-child(3) > .form-group > .ember-basic-dropdown > .ember-power-select-trigger').click({ force: true })
            cy.get('.ember-power-select-option').click()
            cy.get(':nth-child(4) > .form-group > .ember-text-field').type('fake' + Math.random() * 100 + '@gmail.com')
        })
        cy.get(':nth-child(4) > .js-invite-new-employee-item-form > .pad-ver--xs > .col-sm-11 > .row ').within(($form) => {
            cy.get(':nth-child(1) > .form-group > .ember-text-field').type(invitationJSON.firstName)
            cy.get(':nth-child(2) > .form-group > .ember-text-field').type(invitationJSON.lastName)
            cy.get(':nth-child(3) > .form-group > .ember-basic-dropdown > .ember-power-select-trigger').click({ force: true })
            cy.get('.ember-power-select-option').click()
            cy.get(':nth-child(4) > .form-group > .ember-text-field').type('fake' + Math.random() * 100 + '@gmail.com')
        })
        cy.get('[name="message"]').type(invitationJSON.message)
        cy.get('.btn-lg').click()
    })
})
