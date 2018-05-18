describe('Upcoming Celebrations widget- Date Widget ', function () {

	before(function () {
		cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
	})

	beforeEach(function () {
		Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
	})

	it('Make sure that today’s date is correctly reflected in the calendar box', function () {

		cy.visit('/enterprise/dashboard/')
		cy.get('.upcoming-celebrations__hero', { timeout: 20000 }).then(($comp) => {//get upcoming celebration widget
			if ($comp.find('[class="panel-title upcoming-celebrations-calendar__title text-center"]').lenght) {//find calender in it
				cy.get('[class="panel-title upcoming-celebrations-calendar__title text-center"]').then(($monthyear) => {//get year from header	
					cy.get('.js-upcoming-celebrations-calendar__day').then(($dayofmonth) => {//get day and month from body 	
						const todaysDate = Cypress.moment().format("D MMM YYYY")
						const selectedDate = $dayofmonth.text() + ' ' + $monthyear.text()
						expect(todaysDate).to.equal(selectedDate)//date value must be today's date			
					})
				})
			}//else there is no calender component on page there should be a celebration today
		})
	})
	describe('Upcoming Celebrations widget', function () {

		before('Create some employees record with a dependant', function () {
			cy.addEmployee("/cypress/fixtures/employee.json", 5)//add employee with prepared file
			cy.addEmployee("/cypress/fixtures/employee.json", 7)//add employee with prepared file
			cy.addEmployee("/cypress/fixtures/employee.json", 0)//Create another employee, set their birthday to today
		})

		it('The employee that you created should have their birthday and work anniversary coming up in the next 30 days', function () {
			cy.visit('/enterprise/dashboard/')
			cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
				cy.get('[class="col-sm-6 upcoming-celebrations__content"]').then(($comp) => {//get celebration widget
					if ($comp.find('.upcoming-celebrations__content > .pull-right').lenght) {//find "see all" button
						cy.get('.upcoming-celebrations__content > .pull-right').click()//click "see all" button and open celebration popup
						cy.get('[class="table hovered-rows js-celebrations-list"]').contains(employeeJSON.firstName)//employee must be in the popup
					}
					else {//employe must be in celebration widget
						cy.contains(employeeJSON.firstName)
					}
				})
			})
		})

		it('Make sure that you get the “It’s X’s birthday today!” message in the widget', function () {
			cy.visit('/enterprise/dashboard')
			cy.get('[class="col-sm-6 upcoming-celebrations__hero"]').then(($comp) => {//get celebration widget
				if ($comp.text().includes('birthdays')) {//there more than one celebration today 
				}
				else {
					cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
						cy.get('[class="col-sm-6 upcoming-celebrations__hero"]').contains(employeeJSON.firstName)//employee must be in the widget

					})
				}
			})
		})

		it('Make sure that “See all” comes up in the widget', function () {
			cy.visit('/enterprise/dashboard/')
			cy.get('.upcoming-celebrations__content > .pull-right').should('be.visible')//"see all" button must be visible in celebration widget
		})

		it('Click “See all” to get a popup that has the list of employees and their corresponding celebrations coming up in the next 30 days.' +
			'Click on one of them to go to their profile page', function () {
				cy.visit('/enterprise/dashboard/')
				cy.get('.upcoming-celebrations__content > .pull-right').click()//"see all" button and open celebration popup
				cy.get('[class="upcoming-celebrations-dialog__body modal-body ember-view"]').should('be.visible')
				cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
					cy.get('[class="table hovered-rows js-celebrations-list"]').contains(employeeJSON.firstName).click()//find empoleyee and click on it
				})
				cy.url().should('contain', 'profile/personal')//it should bring you to profile editing page
			})

		it('Make sure that the celebrations are in chronological order (soonest at the top)', function () {
			cy.visit('/enterprise/dashboard')
			let date1 = null//define two date variable
			let date2 = null
			cy.get('[class="col-sm-6 upcoming-celebrations__content"] > ul > li', { timout: 30000 }).each(($el, i, array) => {
				cy.wrap($el).find('[class="fake-table__cell text-right pad-lft"]').then(($elementDate) => {
					date2 = new Date($elementDate.text() + ', ' + Cypress.moment().format("YYYY"))//get employee's date
					if (date1 != null) {
						expect(date2).to.be.gte(date1);//compare with previous employee's date it must be greater and equal
					}
					date1 = date2
				})
			})
		})
	})
})

