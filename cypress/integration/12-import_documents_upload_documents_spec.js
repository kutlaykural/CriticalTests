describe('Imports Documents-Upload Documents', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    it('Click on upload files and select the files you want to upload maintaining the file size below 5MB', function () {

        cy.visit('/enterprise/dashboard/company/documents')
        cy.get(':nth-child(13) > [style="touch-action: manipulation; -ms-touch-action: manipulation; cursor: pointer;"] > :nth-child(2)')
        cy.upload_file('upload.jpg', 'input[type="file"]')
        //cy.drop_file('upload.jpg', '[style="position: relative;"] > :nth-child(3)',"text-dusty-gray", "image/jpeg", this.dropEvent);//'[class="col-xs-12 col-sm-6 col-md-4 col-lg-3"] '
        cy.contains("button", "Skip").click()
    })
    // Can also drag and drop documents here.
    // "Assign Documents" test steps same with "06 - unassigned_documents_widget_spec" so it is not remplemented
})