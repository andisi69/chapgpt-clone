const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const chatContainer = document.querySelector(".chat-container")
const deleteButton = document.querySelector("#delete-btn")

let userText = null
const API_KEY = "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"

const initialHeight = chatInput.scrollHeight

const loadDataFromLocalstorage = () => {

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI !<p/>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("chats") || defaultText
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
}

loadDataFromLocalstorage()

const createElement = (html, className) => {
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat", className)
    chatDiv.innerHTML = html
    return chatDiv
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions"
    const pElement = document.createElement("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },

        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    try {
       const response = await (await fetch(API_URL, requestOptions)).json()
       pElement.textContent = response.choices[0].text.trim()
    } catch(error) {
        pElement.classList.add("error")
       pElement.textContent = "Something went wrong while retrieving the response.Please try again!"
    }

    incomingChatDiv.querySelector(".typing-animation").remove()
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    localStorage.setItem("chats", chatContainer.innerHTML)
}


const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./assets/images/chatbot.jpg" alt="user">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>    
                    </div>           
                </div>`
    
    const incomingChatDiv = createElement(html, "incoming")
    chatContainer.appendChild(incomingChatDiv)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    getChatResponse(incomingChatDiv)
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim()
    if(!userText) return
    
    chatInput.value = ""
    chatInput.style.height = `${initialHeight}px`



    const html = `<div class ="chat-content">
                    <div class="chat-details">
                        <img src="./assets/images/user.jpg">
                        <p></p>
                    </div>
                </div> `

    const outgoingChatDiv = createElement(html, "outgoing")
    outgoingChatDiv.querySelector("p").textContent = userText
    document.querySelector(".default-text")?.remove()
    chatContainer.appendChild(outgoingChatDiv)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    setTimeout(showTypingAnimation, 500)
}


deleteButton.addEventListener("click", () => {
    if(confirm("Are you sure you want to remove the all chats?")) {
        localStorage.removeItem("chats")
        loadDataFromLocalstorage()
    }
})



chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault()
        handleOutgoingChat()
    }
})



sendButton.addEventListener("click", handleOutgoingChat)