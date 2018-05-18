describe('Add and Invite Employees', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    it('Click on Add Employees, then Invite Employees, you should now be at the Invitations section', function () {

        cy.visit('/enterprise/dashboard/')
        cy.contains("Add Employees").click()//Click on "Add Employees"
        cy.contains("Invite Employees").click()//click on "Invite Employees" in opened list
        cy.sendInvitation("/cypress/fixtures/invitation.json")//send an invitation with previously defined file
        cy.url().should('contain', '/invitations/create')
    })

    it('Under Create and invite new records Enter the new person’s First name, Last name and email id, choose Plan' +
        'and make sure that only the plans that are under Company Policies are reflected in the drop down menu, then select one of them.', function () {

            cy.visit('/enterprise/dashboard/invitations/create')
            cy.contains("Health Insurance", { timeout: 20000 }).click()//click on health insurance 
            cy.get('.ember-power-select-option ').then((list) => {//get health insures option lists on dropdown
                cy.visit('/enterprise/dashboard/policies')
                cy.get('.table > tbody > tr.loader > :nth-child(3)').then((list2) => {//get health insures option lists on table
                    expect(list2.text().trim()).to.include(list.text().trim())//compare them
                    //Test the list comparasion with approval data like this
                    //expect([1, 2, 3]).to.include.members([3, 2])
                })
            })
        })

    it('Can also as a message to the invite, it will be shown in the invite email sent to the person.', function () {

        cy.visit('/enterprise/dashboard/invitations/create')
        cy.get('[name="message"]').type("Some messages").should('have.value', "Some messages")//message box should be edited
        //IT IS NOT A  COMPLETE TEST SENDING EMAIL COULDNOT BE TESTED
    })

    it('Can also add more member at the same time and send them invite at once following the above steps.' +
        ' Hit Send Invitations, you should get a message that the invitations is successfully sent', function () {

            cy.contains("Invite another colleague", { timeout: 20000 }).click()//click "invite more" button and open second invitation form
            cy.sendTwoInvitations("/cypress/fixtures/invitation.json")//send two invitations
            cy.get('[class="alert alert-success ember-view"]', { timeout: 10000 }).should('be.visible')//invitations should be successfully sent
        })

    it('Click on Pending Invitations, you should see a list of the emails that you sent invitations to' +
        ' along with the date, number of reminders and ability to delete each invitation', function () {
            cy.visit('/enterprise/dashboard/invitations/create/')
            cy.contains("Pending Invitations", { timeout: 10000 }).click()//click on pending invitation tab
            cy.get('table[class="table hovered-rows mar-top--lg"]', { timeout: 20000 }).should('be.visible')//table should be visible
            cy.get(':nth-child(1) > [role="button"] > :nth-child(1)').first().click() //delete first invitation element 
            cy.get(':nth-child(2) > [type="submit"]', { timeout: 20000 }).click()//click confirm button on opened dialog  
            // cy.get(':nth-child(6) > .ember-view').should('not.be.visible', { timeout: 20000 })
            cy.get('[class="alert alert-success active ember-view"]', { timeout: 10000 }).should('be.visible')//pending invitation should be successfully deleted
        })
    //'After hitting Invite an email is been sent on the provided email address which indicated the purpose of the email,'+
    //'to whom it’s addressed to and from which company it’s been sent', - COULDN'T BE TESTED
    //'Click on the link mentioned in the email to register on Bayzat Benefits. - COULDN'T BE TESTED

})