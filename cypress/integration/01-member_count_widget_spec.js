describe('Member Count Widget Spec', function () {

	before(function () {
		//LOGIN and DELETE all employees if there are any
		cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
		cy.deleteAllEmployees()
	})

	beforeEach(function () {
		Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
	})

	it('Use a blank slate, click on Add employees ', function () {
		cy.visit('/enterprise/dashboard/')
		cy.get(':nth-child(12) > .main-menu__link > .main-menu__title').click()//Add Employees button on left menu
		cy.get('.content-header__title').should('be.visible').and('contain', 'Add or Import Employees')//Add employee options page loaded
		cy.contains('a', 'Add Employee').click()//click Add Employee to add single employee
		cy.url().should('include', '/employees/create')//it should take you to the View Team page
	})

	it('Create an employee record with a dependant (set their birthday to 10 days from today and their hire date to 2 weeks from today last year)', function () {
		cy.addEmployee("/cypress/fixtures/employee.json", 10)//add employee with prepared file
	})

	it('The widget should now show 2 members (1 employee – 1 dependant)', function () {
		cy.visit('/enterprise/dashboard/')
		cy.get('.js-members-count-total', { timeout: 20000 }).should('be.visible').then(($counter) => {
			expect(Number($counter.text())).to.eq(2)
		})//Member count widget should be equal 2
	})

	it('Click on See all employees (it should take you to the View Team)', function () {
		//cy.visit('/enterprise/dashboard/')
		cy.contains('See all employees', { timeout: 20000 }).click()//click "see all employees"
		cy.url().should('include', '/employees/list')//it should take you to the View Team page
	})
})

