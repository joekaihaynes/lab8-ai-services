let input = document.getElementById("prompt");
let out = document.getElementById("out");
let run = document.getElementById("run");

function askGroqTest() {
    let question = input.value.trim();
    if(!question){
        out.textContent = "Ask Groq a question!";
        return;
    }

    let key = prompt("What is your Groq API key");
    if(!key)return;

    out.textContent = "Fetching Response"

    fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are concise." },
                { role: "user", content: question }
            ]
        })
    })
    .then(function (r) {
        return r.json().then(function (data) {
            if (!r.ok) throw new Error(r.status + ": " + JSON.stringify(data));
            var answer = (data.choices && data.choices[0].message.content.trim()) || "(no reply)";
            out.textContent = "Q: " + question + "\n\nA: " + answer;
        });
    })
    .catch(function (e) {
        out.textContent = "Error: " + e.message;
    });
}

run.addEventListener("click", askGroqTest);

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        askGroqTest();
    }
});