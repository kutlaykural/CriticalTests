describe('Unassigned documents widget', function () {

	let unassignedDocCount

	before(function () {
		cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
		cy.addEmployee("/cypress/fixtures/employee.json", 10)//create an employee to add assign document
  
	})

	beforeEach(function () {
		Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
	})

	it('Take note of the number of unassigned documents in the widget', function () {

		cy.visit('/enterprise/dashboard')
		cy.get('[class="pull-right widget__link js-unassigned-documents-assign-all text-bold ember-view"]', { timeout: 20000 })
			.should('be.visible')//unassigned document widget should be ready
		cy.get('[class="panel-title widget__title js-unassigned-documents-title"]').then(($unassignedMessage) => {//get unassigned document text
			const res = ($unassignedMessage.text()).split('You have ');
			const res2 = res[1].split('unassigned documents');
			unassignedDocCount = Number(res2[0])//unassigned document count
		})
	})

	it('Go to Import Documents, import a document and click on skip', function () {

		cy.visit('/enterprise/dashboard/documents/upload')
		cy.upload_file('upload.jpg', 'input[type="file"]');//upload a file
		cy.get('.upload__header-assign', { timeout: 50000 }).click()//wait for uploading after click assign button in opened dialog
		cy.contains("button", "Skip").click()//click skip button to keep waiting button for assigning
	})

	it('The number of unassigned documents should increase by 1', function () {

		cy.visit('/enterprise/dashboard')
		cy.get('[class="pull-right widget__link js-unassigned-documents-assign-all text-bold ember-view"]', { timeout: 20000 })
			.should('be.visible')//unassigned document widget should be ready
		cy.get('[class="panel-title widget__title js-unassigned-documents-title"]').then(($unassignedMessage) => {//get unassigned document text
			const res = ($unassignedMessage.text()).split('You have ');
			const res2 = res[1].split('unassigned documents');
			expect(Number(res2[0])).equals(Number(unassignedDocCount) + 1)//unassigned document count should be increased 1
		})
	})

	it.skip('Click on Assign all. It should take you the to Upload Documents page where the first document is displayed and you are able to go through the other unassigned documents', function () {

		//cy.visit('/enterprise/dashboard')
		cy.get('[href="/enterprise/dashboard/documents/unprocessed?assign=all"]', { timeout: 20000 }).click()//find and click "assign all" button
		cy.get('form[class="js-document-form form ember-view"]', { timeout: 20000 }).within(($form) => {
			cy.get('.ember-power-select-selected-item > strong').click()//click "document type" dropdown and open its list
			cy.get('.ember-power-select-options li').contains("Other").click()//find "other" option in list
			cy.get('input[name="title"]').should('be.visible').type("Title")//type to "Title" something
			cy.get('input[name="expiryDateFormatted"]').should('be.visible').clear().type(Cypress.moment().add(10, 'day').format("DD/MM/YYYY"))
			cy.get('[name="description"]').should('be.visible').type("Description")//type something to description
			cy.contains("Please select").should('be.visible').click()//click select persone role dropdown and open its list
			cy.contains("Employee").should('be.visible').click({ force: true })//find "Employee" option in list
			cy.contains("Select Employee").should('be.visible').click()
			cy.readFile("/cypress/fixtures/employee.json").then((employeeJSON) => {
				cy.get('input[type="search"]').should('be.visible').type(employeeJSON.firstName)
				cy.contains('li', employeeJSON.firstName, { timeout: 20000 }).click()
			})
			cy.get('button[type="submit"]').should('be.visible').click()//click submit button to assign document
		})
		cy.get('[class="alert alert-success active ember-view"]', { timeout: 20000 }).should('be.visible')//it should be successfully assigned
		cy.get('.text-dusty-gray > strong').then(($elementMsg) => {//get unassigned document process text 
			const message = $elementMsg.text()//ex: Currently editing document 2 of 250
			expect(Number(message.split('t ')[1].split(' o')[0])).equals(2)	//it should be on second document now
		})
	})
})