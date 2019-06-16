console.log(`Client side javascript has loaded`);



const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-one')
const messageTwo = document.querySelector('#message-two')

weatherForm.addEventListener('submit', (event) => {
  event.preventDefault();

  messageOne.textContent = 'Loading...'
  messageTwo.textContent = ''

  fetch('/weather?address=' + search.value)
    .then((res) => {
      res.json()
        .then(data => {
          if (data.error) {
            messageOne.textContent = data.error
          } else {
            messageOne.textContent = data.location
            messageTwo.textContent = data.forecast
          }
        })
    })
})