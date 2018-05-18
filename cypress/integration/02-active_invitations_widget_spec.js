describe('Active invitations widget', function () {

	let invitationCount

	before(function () {
		cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
	})

	beforeEach(function () {
		Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
	})

	it('See number of pending invitation At Dashboard. And note it', function () {

		cy.visit('/enterprise/dashboard/')
		cy.get('.js-invitations-count-pending').should('be.visible').then(($counter) => {
			invitationCount = $counter.text()
		})//get invitation count and note it	
	})

	it('Click on Invite Employees/ Send out an invitation', function () {

		cy.visit('/enterprise/dashboard/')
		cy.contains("Invite more employees", { timeout: 10000 }).click()//click "Invite Employees" button 
		cy.url().should('include', '/invitations/create')//it should take you to the Invitations page
		cy.sendInvitation("/cypress/fixtures/invitation.json")//send invitation with prepared file
		cy.get('[class="alert alert-success ember-view"]', { timeout: 10000 }).should('be.visible')//invitation successfully sent
	})

	it('Go back to the dashboard, the widget should reflect the extra invitation that you sent', function () {

		cy.visit("/enterprise/dashboard/")
		cy.get('.js-invitations-count-pending', { timeout: 10000 }).should('be.visible').then(($counter) => {
			expect(Number($counter.text())).to.eq(Number(invitationCount) + 1)
		})//get invitation count and compare it with previous one
	})
})

