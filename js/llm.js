export function askLLM(apiKey, userText, callback) {
    if(!apiKey){
        callback(null, "No API key found.");
        return;
    }


    fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "user", content: userText },
            ]
        })
    })
        .then(function (r) {
            return r.json().then(function (data) {
                try {
                    let content = data.choices[0].message.content;
                    callback(content, null);
                } catch (e) {
                    callback(null, "Bad response format.");
                }
            });
        })
        .catch(function (e) {
            callback(null,"Network Error");
        });
}