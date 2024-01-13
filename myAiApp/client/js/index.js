/*
  Functions:
  - setMessageHeight:Set height of message conatiner.
  - scrollToBottom: Scrolls message container to bottom.
  - afterSubmit: Empty input field.
  - createSkelaton: Creates a Doris skelaton with "typing" animation.
  - createUserMessage: Creates the message from the user input.
  - createMessage: Creates the answer message from Doris.
  - addYesOrNo: Creates yes/no buttoms for user to interact with Doris.
  - offerContact: Creation of messege where user can get Johns emailaddress 
  - run: Start, make actions of the user input.
*/

/**
 * @function setMessageHeight
 * @description Set height of message conatiner.
 */
function setMessageHeight() {
  msgHeight = msgCont.offsetHeight - 35 //header height
  if(msgDiv.scrollHeight >= msgHeight) {
    msgDiv.setAttribute("style","height:" + msgHeight + 'px;')
  } else {
    msgDiv.setAttribute("style","max-height:" + msgHeight + 'px;')
  }
}

/**
 * @function scrollToBottom
 * @description Scrolls message container to bottom.
 */
function scrollToBottom() {
  msgDiv.style.height = msgHeight
  msgDiv.scrollTop = msgDiv.scrollHeight
}

/**
 * @function afterSubmit
 * @description Empty input field.
 */
function afterSubmit() {
  scrollToBottom()
  document.getElementById('message').value = ''
}

/**
 * @function createSkelaton
 * @description Creates a Doris skelaton with "typing" animation.
 */
function createSkelaton(){
  const messages = document.querySelector('.messages')
  const dorisConatiner = document.createElement('div')
  dorisConatiner.className = 'doris-container'

  messages.appendChild(dorisConatiner)

  dorisConatiner.innerHTML = '<img class="doris-img" src="./img/AvatarMaker.png" alt="ai-avatar Doris" />' +
                              '<div id="message' + dorisMessageCount + '" class="doris-message">' +
                                '<div id="wave" class="wave">' +
                                  '<div class="dot"></div>' +
                                  '<div class="dot"></div>' +
                                  '<div class="dot"></div>' +
                                  '<div class="dot"></div></div></div>'
  
}

/**
* @function createUserMessage
* @description Creates the message from the user input.
* @param {String} text - The user input text.
*/
function createUserMessage(text) {
  const messages = document.querySelector('.messages')
  const userContainer = document.createElement('div')
  userContainer.className = 'user-container'
  const userMessage = document.createElement('div')
  userMessage.className = 'user-message'
  const message = document.createElement('p')
  message.className = 'user'
  message.innerText = text

  userMessage.appendChild(message)
  userContainer.appendChild(userMessage)
  messages.appendChild(userContainer)
}

/**
* @function createMessage
* @description Creates the answer message from Doris.
* @param {String} text - The chatGPT answer text.
*/
function createMessage(text) {
  const dorisMessage = document.querySelector('#message' + dorisMessageCount)
  const wave = document.getElementById("wave");
  wave.remove();

  const name = document.createElement('p')
  name.className = 'name'
  name.innerText = 'Doris'
  const message = document.createElement('p')
  message.className = 'doris'
  message.innerText = text
  
  dorisMessage.appendChild(name)
  dorisMessage.appendChild(message)
}

/**
* @function addYesOrNo
* @description Creates yes/no buttoms for user to answer Doris.
*/
function addYesOrNo() {

  const messages = document.querySelector('.messages')
  const buttonContainer = document.createElement('div')
  buttonContainer.className = 'user-container'
  const buttons = document.createElement('div')
  buttons.className = 'user-message'
  const yes = document.createElement('button')
  const no = document.createElement('button')

  yes.innerText = 'YES'
  no.innerText = 'NO'
  yes.addEventListener('click', function (event) {
    const text2 = "Here you go, mail@gmail.com"
    createSkelaton()
    scrollToBottom()
    createMessage(text2)
    scrollToBottom()
    dorisMessageCount++
  })
  no.addEventListener('click', function (event) {
    createSkelaton()
    scrollToBottom()
    createMessage("Ok")
    scrollToBottom()
    dorisMessageCount++
  })

  buttons.appendChild(yes)
  buttons.appendChild(no)
  buttonContainer.appendChild(buttons)
  messages.appendChild(buttonContainer)
}

/**
* @function offerContact
* @description Creation of messege where user can get Johns emailaddress
*/
function offerContact() {
  const text = "I see that you are interested in John, that's great! Would you like to have his email for further contact?"
  createSkelaton()
  scrollToBottom()
  setTimeout(() => {
    createMessage(text)
    scrollToBottom()
    dorisMessageCount++
    addYesOrNo()
    scrollToBottom()
  }, 3000);
}

/**
* @function run
* @description Start, make actions of the user input.
*/
function run() {
  document.getElementById('myForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  createUserMessage(jsonData.message)
  createSkelaton()
  afterSubmit()

  try {
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    }); 

    const answer = await response.json();
    createMessage(answer.message, 'doris')
    scrollToBottom()
    dorisMessageCount++
    if(dorisMessageCount === 3) {
      offerContact()
    }
  } catch (error) {
    console.error('Error, something went wrong when communicating withe the server:', error);
  }
});
}

run()

let dorisMessageCount = 0

const msgCont = document.getElementById("message-container")
const msgDiv = document.getElementById("messages")
let msgHeight = msgCont.offsetHeight - 35 //header height
msgDiv.setAttribute("style","max-height:" + msgHeight + 'px;')

window.onresize = setMessageHeight;
