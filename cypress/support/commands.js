// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.overwrite('visit', (orig, url, options) => {
    return orig(Cypress.env('host_with_credentials')+url, options)
})
Cypress.Commands.add('loginByCSRF', (username, password) => {
    cy.clearCookies()
    cy.request(Cypress.env('host_with_credentials')+'/login').its('body').then((body) => {
        const csrfToken = Cypress.$(body).find("[name=_csrf_token]").val()
        cy.request({
            method: 'POST',
            url: Cypress.env('host_with_credentials')+'/login_check',
            failOnStatusCode: false, // dont fail so we can make assertions
            form: true, // we are submitting a regular form body
            body: {
                _username: username,
                _password: password,
                _csrf_token: csrfToken
            }
        })
    })
})

Cypress.Commands.add('drop_file', (fileName, drop_area, ondropClass, fileType, dragEvent) => {
    cy.get(drop_area).first().then(subject => {// get first element
        cy.fixture(fileName, 'base64', { type: fileType }).then((content) => {
            // method need to be tested and now it doesn't WORK
            //normally this method must get drop_area component and work with commented lines
            //but now it gets file_input component and work like upload_file method 
            const el = subject[0];
            const blob = b64toBlob(content, fileType);
            const testFile = new File([blob], fileName, { type: fileType });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(testFile);
            //dragEvent = new DragEvent("drop", { dataTransfer: dataTransfer });
            dragEvent = {
                dataTransfer: {
                  files: [{
                    name: fileName,
                    size: 32796,
                    type: "image/jpeg",
                    lastModified: 1510154936000,
                    webkitRelativePath: ""
                  }],
                  types: ["Files"]
                }
              }

            cy.get(drop_area)
            .trigger('dragover', { dataTransfer: dataTransfer })
            .trigger('dragenter', { dataTransfer: dataTransfer })
            .should('have.class',ondropClass)
            .trigger('drop',{ dragEvent , force:true })//{ force:true, dataTransfer: dataTransfer }
        //
        //
                
        });
    });
});

Cypress.Commands.add('upload_file', (fileName, selector) => {
    cy.get(selector, { timeout: 20000 }).then(subject => {
        cy.fixture(fileName, 'base64').then((content) => {
            const el = subject[0];
            const blob = b64toBlob(content);
            const testFile = new File([blob], fileName);
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(testFile);
            el.files = dataTransfer.files;
        });
    });
});

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    blob.lastModifiedDate = new Date();
    return blob;
}