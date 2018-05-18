describe('Time OFF', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    // This steps could not be tested
    // 1) Configure time off (fresh company) a) Download configure sheet b) Update configure sheet and upload c) Changes reflected in time off dashboard and employee profile time off tab
    // 2) Leave request by HR a) Changes in leave reflected in employee profile time off tab b) Time off dashboard reflects the accepted leave c) Email is sent to the employee

    it('Leave request by employee', function () {
        cy.visit('/enterprise/dashboard/')
        cy.get('a[href="/enterprise/dashboard/profile/time-off"] > .main-menu__title.js-main-menu__title')
            .click()//click "my time-off" button on left menu
        cy.get('form input[name="dateFromFormatted"]', { timeout: 40000 }).should('be.visible').type(Cypress.moment().format("DD/MM/YYYY"), { force: true })//type today's date to first date
        cy.get('form input[name="dateToFormatted"]').type(Cypress.moment().add(4, 'day').format("DD/MM/YYYY"), { force: true })//type 4 day after today's date to last date
        cy.get('input[name="days"]').type('4', { force: true })//type intervar as 4
        cy.get('[name="message"]').type('some message', { force: true })//type some messages
        cy.get('button[type="submit"]').click({ force: true })//click on "Request" button
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 30000 }).should('be.visible')//Leave request successfully saved
    })

    it('Delete request by employee', function () {
        cy.get('[class="js-leave-request-item loader mar-btm--lg ember-view"] :first button[class="mar-lft--xs text-silver bord-rounded--md btn btn-default ember-view"]')
            .click({ force: true })//click request's right top option's icon
        cy.get('.js-leave-request__dropdown-delete', { timeout: 10000 }).click({ force: true })//select delete option on list 
        cy.get('.btn-danger', { timeout: 20000 }).click({ force: true })//confirm deletion with click in delete button 
        cy.get('[class="alert alert-success active ember-view"]', { timeout: 20000 }).should('be.visible')//Leave request successfully deleted
    })

    // This steps could not be tested
    //4) Stage changes by HR
    //5) Email triggers
})