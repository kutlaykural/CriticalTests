describe('Add Employees-Upload Excel Sheet', function () {

    before(function () {
        cy.loginByCSRF(Cypress.env('username'), Cypress.env('password'))
        cy.deleteAllEmployees()
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce(Cypress.env('session_name'))
    })

    //THIS TEST STEPS CANNOT BE IMPLEMENTED
    //a Click on Add Employees, then Upload Excel Sheet, you should be at the 2-step excel import section - JUST DONE in "view_team_spec"
    //b	Click on Download Excel, you should get a message with some information, click Got It - JUST DONE in "view_team_spec"	
    //c	The excel sheet should be downloaded - OUT OF BROWSER SCOPE	
    //d	Copy and paste the data from the excel sheet provided	- OUT OF BROWSER SCOPE
    //e	Manually create a new record in the excel sheet with First Name, Last Name and Employee fields filled out then save the file and - OUT OF BROWSER SCOPE

    it('upload it by clicking on Upload Excel.', function () {

        cy.visit('/enterprise/dashboard/import-users')
        cy.get('[class="btn btn-primary btn-lg btn-labeled fa fa-upload mar-ver ember-view"]').click()//click "upload excel sheet" button  
        cy.upload_file('employee_export.xlsx', 'input[type="file"]');//upload existing excel file 
        cy.get('[type="submit"]').click()//click "Yes,proceed" button at confirmation dialog popup
        //CONTROL OF THE RESULT IS COMMENTED BECAUSE OF APLICATION NOT WORK DETERMINISTIC
        // on fault class should also be 'fa fa-2x fa-close text-danger' or  'fa fa-2x fa-minus'
        // cy.get('[class="col-sm-6 bg-alabaster text-center mar-top pad-btm js-equal-height-result-box js-up-to-date-box clearfix"]')
        // .find('[class="fa fa-2x fa-check text-jungle-green"]',{timeout:50000})//The Excel is up to date? 
        // cy.get('[class="col-sm-6 bg-alabaster text-center mar-top pad-btm js-equal-height-result-box js-valid-box clearfix"]')
        // .find('[class="fa fa-2x fa-check text-jungle-green"]',{timeout:50000})//The document is valid? 
    })

    //THIS TEST STEPS CANNOT BE IMPLEMENTED
    //f	Once it is done, go to View Team and make sure that the new records there	    
    //g	You should also see a lot of new data in the dashboard as well
})