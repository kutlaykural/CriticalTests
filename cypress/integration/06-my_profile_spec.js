describe('My Profile', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    it('Click on Complete profile, Complete a couple of sections then make sure that' +
        ' the red x for the relevant sections turns into a green ✓ a yellow x if the documents are expired', function () {

            cy.visit('/enterprise/dashboard/')
            cy.get('[class="widget__list-item js-passport"]', { timeout: 20000 }).find('[class="fa fa-times-circle fa-lg text-danger"]')
                .should("be.visible")//assume that passport document is missing with red X icon
            cy.contains("Complete profile").click()//click "Complete profile" button
            cy.get('.bg--athens-gray > :nth-child(2) > div', { timeout: 20000 })// wait for page load with tab navigator  
            cy.contains("a", "Documents").click()// click "Documents" tab link
            //cy.drop_file('upload.jpg', '[class="col-xs-12 col-sm-6 col-md-4 col-lg-3"] ', "image/jpeg", this.dropEvent);// //DROP DOES  NOT WORK
            cy.upload_file('upload.jpg', 'input[type="file"]');
            cy.get('.upload__header-assign', { timeout: 60000 }).click()//click assign button apeared after upload
            cy.readFile("/cypress/fixtures/employee(full).json").then((employeefullJSON) => {
                cy.get('.form-group.js-property-type > .ember-basic-dropdown.ember-view > .ember-basic-dropdown-trigger.ember-basic-dropdown-trigger--in-place.ember-view')
                    .click({ force: true })//select document type dropdown box and open option list
                cy.get('.ember-basic-dropdown-content > .ember-view').contains("Passport").click({ force: true })//select document type "Passport" in list
                cy.get('.form-group.js-property-nationality > .ember-basic-dropdown.ember-view > .ember-basic-dropdown-trigger.ember-basic-dropdown-trigger--in-place.ember-view > span:nth-of-type(1)')
                    .click({ force: true })//select nationality dropdown box and open option list
                cy.get('.ember-basic-dropdown-content > .ember-view').contains(employeefullJSON.nationality)
                    .click({ force: true })//select nationality from opened list
                cy.get('.form-group.js-property-gender > .ember-basic-dropdown.ember-view > .ember-basic-dropdown-trigger.ember-basic-dropdown-trigger--in-place.ember-view')
                    .click({ force: true })//select gender dropdown box and open option list
                cy.get('.ember-basic-dropdown-content > .ember-view').contains(employeefullJSON.gender)
                    .click({ force: true })//select gender from opened list
                cy.get('input[name="number"]').type("12345", { force: true })//type something to passport no field
                cy.get('input[name="dateBirthFormatted"]')
                    .clear().type(employeefullJSON.birthDate)
                cy.get('input[name="expiryDateFormatted"]')
                    .clear().type(Cypress.moment().add(10, 'day').format("DD/MM/YYYY"))
            })
            cy.get(':nth-child(1) > [type="submit"]').click({ force: true })//click submit button to assign document
            cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//document should be successfully assigned
            cy.visit('/enterprise/dashboard/')
            cy.get('[class="widget__list-item js-passport"]', { timeout: 20000 }).find('[class="fa fa-check-circle fa-lg text-jungle-green"]')
                .should("be.visible")//now that passport must be exists with ✓ icon
        })

    it('Delete the passport', function () {
        cy.visit('/enterprise/dashboard/')
        cy.get('[class="widget__list-item js-passport"]', { timeout: 20000 }).find('[class="fa fa-check-circle fa-lg text-jungle-green"]')
            .should("be.visible")//now that passport must be exists with ✓ icon
        cy.contains("Complete profile").click()//click "Complete profile" button 
        cy.get('.bg--athens-gray > :nth-child(2) > div', { timeout: 20000 })// wait for page load with tab navigator  
        cy.contains("a", "Documents").click()// click "Documents" tab link
        cy.get('.row.js-mandatory-documents > div:nth-of-type(1) > .panel.panel--no-background.panel--shadow.js-document-item.ember-view > .panel-heading.text-right.text-manatee > span:nth-of-type(1) > button[type="button"].btn.fa.fa-trash-o.btn-icon.ember-view')
            .click()//click passport documents edit button
        cy.get('.modal.fade.in > .modal-dialog.modal-md > .modal-content > form.modal-footer.ember-view > button[type="submit"].btn.btn-danger.ember-view')
            .click()//now click delete button and delete document
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//document should be successfully deleted
    })
})