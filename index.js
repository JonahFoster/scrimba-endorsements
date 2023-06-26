import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-60636-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementList")

const endorsementEl = document.getElementById('endorsement')
const fromEl = document.getElementById('from')
const toEl = document.getElementById('to')
const publishBtn = document.getElementById('publish-btn')
const endorsementContainer = document.getElementById('endorsement-container')

publishBtn.addEventListener('click', function() {
    let endorsement = endorsementEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value
    let likeCount = 0

    endorsementEl.value = ""
    fromEl.value = ""
    toEl.value = ""

    let newEndorsement = {
        endorsementDB: endorsement,
        fromDB: fromValue,
        toDB: toValue,
        likeCount: likeCount
    }

    push(endorsementsInDB, newEndorsement)
})

function addEndorsement(endorsementID, endorsementValue) {
    let newEndorsement = document.createElement('div')

    newEndorsement.className = 'endorsement-item'
    newEndorsement.innerHTML = `
        <p class="endorsement-tofrom">To ${endorsementValue.toDB}</p>
        <p>${endorsementValue.endorsementDB}</p>
        <div id="endorsement-footer">
            <p class="endorsement-tofrom">From ${endorsementValue.fromDB}</p>
            <p id="${endorsementID}" class="like-counter">❤️ ${endorsementValue.likeCount}</p>
        </div>`

    let likeButton = newEndorsement.querySelector(`#${endorsementID}`)

    likeButton.addEventListener('click', function() {
        endorsementValue.likeCount += 1
        likeButton.innerHTML = `❤️ ${endorsementValue.likeCount}`
        let endorsementRef = ref(database, `endorsementList/${endorsementID}/likeCount`)
        set(endorsementRef, endorsementValue.likeCount)
    })

    endorsementContainer.prepend(newEndorsement)
}

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        endorsementContainer.innerHTML = ""

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let endorsementID = currentItem[0]
            let endorsementValue = currentItem[1]

            addEndorsement(endorsementID, endorsementValue)
        }
    } else {
        endorsementContainer.innerHTML = "No endorsements yet."
    }
})
