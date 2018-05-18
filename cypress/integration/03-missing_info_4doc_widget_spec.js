describe('Missing information-documents widget', function () {

	before('Login', function () {
		cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
		//It should have 1 employee with missing information
		//(assuming you only added one employee to the blank slate)
		cy.addEmployee("/cypress/fixtures/employee.json", 3)//add employee  with prepared file
	})

	beforeEach(function () {
		Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
	})

	it('missing information- Click on Find out who, it should take you to View Team (filtered by active status, incomplete profile and missing information)', function () {

		cy.visit('/enterprise/dashboard/')
		cy.contains("Find out who", { timeout: 20000 }).click({ force: true })//click "Find out who" button
		cy.get('.filter__selected-items > .text-tertiary', { timeout: 20000 }).click()//click "clear filters" button
		cy.get('.filter__selected-items > .text-tertiary').should('not.be.visible', { timeout: 30000 })//filters should be cleaned
		cy.get('button[type="button"].filter__trigger').click()//click "FILTER BY" button
		cy.get('.filter__menu', { timout: 20000 }).within(($form) => {
			cy.get('.row.filter__row:nth-of-type(1) > .filter__list.list-inline > .filter__item:nth-of-type(2) > i.fa.filter__item-icon.fa-square-o')
				.click()// incomplete option 
			cy.get('.row.filter__row.filter__item--shadowed:nth-of-type(3) > .filter__list.list-inline > .filter__item:nth-of-type(1) > i.fa.filter__item-icon.fa-square-o')
				.click()// all information option
			cy.get('.row.filter__row:nth-of-type(7) > .filter__list.list-inline > .filter__item:nth-of-type(1) > i.fa.filter__item-icon.fa-square-o')
				.click() //status active makes conflict
			cy.get('button[type="button"].btn.filter__submit')
				.click()// apply filter
		})
		cy.get('.filter__selected-items > .text-tertiary', { timeout: 20000 }).should('be.visible')// "clear filters" button should be visible
		cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
			cy.get('input[type="search"]').type(employeeJSON.firstName)  //search employee with its first name
			cy.get('.panel > .pad-btm').contains('tr', employeeJSON.firstName)//element must be there
		})
	})

	it('missing documents- Click on Find out who, it should take you to View Team (filtered by active status, incomplete profile and missing documents)', function () {

		cy.visit('/enterprise/dashboard/')
		cy.contains("Find out who", { timeout: 20000 }).click({ force: true })//click "Find out who" button
		cy.contains("Find out who", { timeout: 20000 }).click({ force: true })//click "Find out who" button
		cy.get('.filter__selected-items > .text-tertiary', { timeout: 20000 }).click()//click "clear filters" button
		cy.get('.filter__selected-items > .text-tertiary').should('not.be.visible', { timeout: 30000 })//filters cleaned
		cy.get('button[type="button"].filter__trigger').click()//click "FILTER BY" button
		cy.get('.filter__menu ', { timout: 20000 }).within(($form) => {
			cy.get('.row.filter__row:nth-of-type(1) > .filter__list.list-inline > .filter__item:nth-of-type(2) > i.fa.filter__item-icon.fa-square-o')
				.click()// incomplete option 
			cy.get('.row.filter__row.filter__item--shadowed:nth-of-type(2) > .filter__list.list-inline ', { timout: 20000 }).within(($formnode) => {
				cy.get('.filter__item:nth-of-type(1) > i.fa.filter__item-icon.fa-square-o').click({ force: true })// passport
				cy.get('.filter__item:nth-of-type(2) > i.fa.filter__item-icon.fa-square-o').click({ force: true })// emirates ID 
				cy.get('.filter__item:nth-of-type(3) > i.fa.filter__item-icon.fa-square-o').click({ force: true })// residency visa
				cy.get('.filter__item:nth-of-type(4) > i.fa.filter__item-icon.fa-square-o').click({ force: true })// passport photo
			})
			cy.get('.row.filter__row:nth-of-type(7) > .filter__list.list-inline > .filter__item:nth-of-type(1) > i.fa.filter__item-icon.fa-square-o')
				.click() //status active makes conflict
			cy.get('button[type="button"].btn.filter__submit').click()// apply filter
		})
		cy.get('.filter__selected-items > .text-tertiary').should('be.visible', { timeout: 20000 })// "clear filters" button should be visible
		cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
			cy.get('input[type="search"]').type(employeeJSON.firstName)  //search employee with its first name
			cy.get('.panel > .pad-btm').contains('tr', employeeJSON.firstName) //element must be there
		})
	})
})

