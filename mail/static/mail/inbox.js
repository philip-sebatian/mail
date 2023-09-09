document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
//posting the form data 
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelector("#compose-form").addEventListener('submit',()=>{
    let mail=document.querySelector('#compose-recipients').value
    let body=document.querySelector("#compose-body").value
    let subject=document.querySelector("#compose-subject").value
    fetch("/emails",{
      method:'POST',
      body : JSON.stringify({
        recipients:mail,
        subject:subject,
        body:body
  
  
      })
    })
    .then(responce=>responce.JSON())
    .then(result=>{
      console.log(result);
    });
    return false
  
  });
});

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#inbox').addEventListener('click',()=>{
    fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print email
      console.log(emails);
      emails.forEach(element => {
        
          let div_element=document.createElement('div');
          div_element.innerHTML=element.sender;
          let body=document.createElement('p');
          body.innerHTML=element.body
          document.querySelector("#emails-view").append(div_element)
          document.querySelector("#emails-view").append(body)
        
        
      });
  
      // ... do something else with email ...
  });
  });
});