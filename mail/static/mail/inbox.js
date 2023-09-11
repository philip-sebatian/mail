
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  
//to check
  // By default, load the inbox
  load_mailbox('inbox');
});
function email_content(){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display='block'
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-content').style.display='none'

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display='none';

  if(mailbox=='sent'){
    fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {
      // Print email
      console.log(emails);
      emails.forEach(element => {
        
          let div_element=document.createElement('div');
          div_element.addEventListener('click',()=>{
            email_content()
            fetch('/emails/'+element.id)
            .then(responce=>{
              return responce.json()
            })
            .then(mail=>{
              document.querySelector('#view_sender').value=mail.sender
                document.querySelector('#view-recipients').value=mail.recipients
                document.querySelector('#view-subject').value=mail.subject
                document.querySelector("#view-body").value=mail.body
              
              
              
            })
          })
          div_element.innerHTML=element.sender;
          let body=document.createElement('p');
          let time=document.createElement('p')
          time.innerHTML=element.timestamp
          body.innerHTML=element.subject
          document.querySelector("#emails-view").append(div_element)
          div_element.append(body)
          div_element.append(time)
        
        
      });
  
      // ... do something else with email ...
  });
  }
  
  
  if(mailbox==='inbox'){
    
    fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print email
      console.log(emails);
      
      emails.forEach(element => {
        
          let div_element=document.createElement('div');
          div_element.innerHTML=element.sender;
          
          
          div_element.addEventListener('click',()=>{
            email_content();
            
              fetch(`emails/${element.id}`,{
                method:'PUT',
                body:JSON.stringify(
                  {
                    read:true
                  }
                )
              })
            
            fetch('/emails/'+element.id)
            .then(responce=>{
              return responce.json()
            })
            .then(mail=>{
                
                document.querySelector('#view_sender').value=mail.sender
                document.querySelector('#view-recipients').value=mail.recipients
                document.querySelector('#view-subject').value=mail.subject
                document.querySelector("#view-body").value=mail.body
                let button=document.createElement('button')
                
                
                let archive_btm=document.createElement('button')
                button.classList.add("btn")
                button.classList.add("btn-primary")
                archive_btm.style.paddingLeft='10px'
                archive_btm.classList.add("btn")
                archive_btm.classList.add("btn-primary")
                
                button.innerHTML='Reply'
                archive_btm.innerHTML="archive"
                button.addEventListener('click',()=>{
                compose_email()
                document.querySelector("#compose-recipients").value=mail.sender
                document.querySelector('#compose-subject').value='Re: '+mail.subject
                document.querySelector('#compose-body').value=`On ${mail.timestamp} ${mail.sender} wrote: ${mail.body}`
                
              })
                archive_btm.addEventListener('click',()=>{
                  fetch(`/emails/${mail.id}`,{
                    method:"PUT",
                    body:JSON.stringify(
                      {
                        archived:true
                      }
                    )

                    
                  });
                  location.reload()
                })
              if(!mail.archived){
                document.querySelector('#email-content').append(archive_btm)

              }
              document.querySelector('#email-content').append(button)
              })
              
              
          })
          if(!element.read){
            div_element.style.backgroundColor='white'

          }
          else{
            div_element.style.backgroundColor='grey'
          }
          div_element.innerHTML=element.sender;
          let body=document.createElement('p');
          let time=document.createElement('p')
          time.innerHTML=element.timestamp
          body.innerHTML=element.subject
          document.querySelector("#emails-view").append(div_element)
          div_element.append(body)
          div_element.append(time)
        
        
      });
  
      // ... do something else with email ...
  });
  }


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
}
//rediretc to sent

//posting the form data 
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelector("#compose-form").addEventListener('submit',(event)=>{
    event.preventDefault()
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
    .then(responce=>responce.json())
    .then(result=>{
      console.log(result);
      load_mailbox('sent')
    });
    
    
  
  });
});
//inbox function
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#inbox').addEventListener('click',()=>{
    if(document.querySelector('#emails-view').firstChild){
      
      return
    }
    fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print email
      
      
      emails.forEach(element => {
        
          let div_element=document.createElement('div');
          div_element.innerHTML=element.sender;
          
          
          div_element.addEventListener('click',()=>{
            email_content();
            fetch('/emails/'+element.id)
            .then(responce=>{
              return responce.json()
            })
            .then(mail=>{
                mail_div=document.createElement('div')
                document.querySelector('#email-content').append(mail_div.innerHTML=`sender:${mail.sender}  body:${mail.body}`)
                let button=document.createElement('button')
                let archive_btm=document.createElement('Reply')
                button.classList.add("btn")
                button.classList.add("btn-primary")
                archive_btm.classList.add("btn")
                archive_btm.classList.add("btn-primary")
                archive_btm.style.paddingLeft='10px'
                button.innerHTML='button'
                archive_btm.innerHTML="archive"
                button.addEventListener('click',()=>{
                compose_email()
                
                document.querySelector("#compose-recipients").value=mail.sender
                document.querySelector('#compose-subject').value='Re: '+mail.subject
                document.querySelector('#compose-body').value=`On ${mail.timestamp} ${mail.sender} wrote: ${mail.body}`
                
              })
                archive_btm.addEventListener('click',()=>{
                  fetch(`/emails/${mail.id}`,{
                    method:"PUT",
                    body:JSON.stringify(
                      {
                        archived:true
                      }
                    )

                    
                  });
                  location.reload()
                })
              if(!mail.archived){
                document.querySelector('#email-content').append(archive_btm)

              }
              document.querySelector('#email-content').append(button)
              })
          })
          div_element.innerHTML=element.sender;
          let body=document.createElement('p');
          let time=document.createElement('p')
          time.innerHTML=element.timestamp
          body.innerHTML=element.subject
          document.querySelector("#emails-view").append(div_element)
          div_element.append(body)
          div_element.append(time)
        
        
      });
  
      // ... do something else with email ...
  });
  });
});
//sent emails function
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#sent').addEventListener('click',()=>{
    if(document.querySelector('#emails-view').firstChild){
      return
    }
    fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {
      // Print email
      console.log(emails);
      emails.forEach(element => {
        
          let div_element=document.createElement('div');
          div_element.addEventListener('click',()=>{
            email_content()
            fetch('/emails/'+element.id)
            .then(responce=>{
              return responce.json()
            })
            .then(mail=>{
              document.querySelector('#view_sender').value=mail.sender
                document.querySelector('#view-recipients').value=mail.recipients
                document.querySelector('#view-subject').value=mail.subject
                document.querySelector("#view-body").value=mail.body
              
              
              
            })
          })
          div_element.innerHTML=element.sender;
          let body=document.createElement('p');
          let time=document.createElement('p')
          time.innerHTML=element.timestamp
          body.innerHTML=element.subject
          document.querySelector("#emails-view").append(div_element)
          div_element.append(body)
          div_element.append(time)
        
        
      });
  
      // ... do something else with email ...
  });
  });
});

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#archived').addEventListener('click',()=>{
    fetch('/emails/archive')
  .then(response => response.json())
  .then(emails => {
      // Print email
      console.log(emails);
      
      emails.forEach(element => {
        
          let div_element=document.createElement('div');
          div_element.innerHTML=element.sender;
          
          
          div_element.addEventListener('click',()=>{
            email_content();
            fetch('/emails/'+element.id)
            .then(responce=>{
              return responce.json()
            })
            .then(mail=>{
              document.querySelector('#view_sender').value=mail.sender
              document.querySelector('#view-recipients').value=mail.recipients
              document.querySelector('#view-subject').value=mail.subject
              document.querySelector("#view-body").value=mail.body
            
                let button=document.createElement('button')
                let archive_btm=document.createElement('button')
                button.classList.add("btn")
                button.classList.add("btn-primary")
                archive_btm.classList.add("btn")
                archive_btm.classList.add("btn-primary")
                
                button.innerHTML='Reply'
                archive_btm.innerHTML="unarchive"
                button.addEventListener('click',()=>{
                compose_email()
                document.querySelector("#compose-recipients").value=mail.recipients
                document.querySelector('#compose-subject').value='Re: '+mail.subject
                document.querySelector('#compose-body').value=`On ${mail.timestamp} ${mail.sender} wrote: ${mail.body}`
                
                
              })
                archive_btm.addEventListener('click',()=>{
                  fetch(`/emails/${mail.id}`,{
                    method:"PUT",
                    body:JSON.stringify(
                      {
                        archived:false
                      }
                    )

                    
                  })
                  .then(responce=>{
                    location.reload()
                  })

                })
              if(mail.archived){
                document.querySelector('#email-content').append(archive_btm)

              }
              document.querySelector('#email-content').append(button)
              })
          })
          div_element.innerHTML=element.sender;
          let body=document.createElement('p');
          let time=document.createElement('p')
          time.innerHTML=element.timestamp
          body.innerHTML=element.subject
          document.querySelector("#emails-view").append(div_element)
          div_element.append(body)
          div_element.append(time)
        
        
      });
  
      // ... do something else with email ...
  });
  });
});


