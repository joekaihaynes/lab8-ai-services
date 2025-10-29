/**
 * Creates a View instance for rendering the chat interface and handling user interactions.
 * @param {Document} doc - The document object (defaults to global document).
 * @returns {Object} View API with render method and setter properties for event handlers.
 */

export function View(doc){
    let d = document;
    let list = d.querySelector(".messages")
    let form = d.querySelector(".input-area");
    let input = form.querySelector("input");
    let count = d.getElementById("msgCount");
    let exptButton = d.getElementById("exportButton");
    let impButton = d.getElementById("importButton");
    let clrButton = d.getElementById("clearButton");

    let onSend = null;
    let onImport = null;
    let onExport = null;
    let onClear = null;
    let onEdit = null;
    let onDelete = null;

    /**
     * Renders the chat messages list from state.
     * Shows empty state message when no messages exist.
     * @param {Object} state - Application state containing messages array.
     */
    function render(state){
        let items = (state && state.messages) ? state.messages : [];
        list.innerHTML = "";

        if(!items.length){
            let empty = d.createElement("p");
            empty.className = "empty-convo";
            empty.textContent = "No messages yet. Start a conversation!";
            list.appendChild(empty);
        }else{
            for (let i = 0; i < items.length; i++) {
                let m = items[i];

                let optionsRow = d.createElement("message-row");
                optionsRow.className = "msg-row " + (m.role);
                optionsRow.dataset.id = m.id;

                let tBubble = d.createElement("text-bubble");
                tBubble.className = (m.role === "user") ? "user" : "bot";
                tBubble.textContent = m.text || "";
                optionsRow.appendChild(tBubble);

                if(m.role === "user"){
                    let action = d.createElement("option-row");

                    let delButton = d.createElement("button");
                    delButton.className = "deleteButton";
                    delButton.type = "button";
                    delButton.textContent = "Delete";
                    delButton.dataset.action = "delete";

                    let editButton = d.createElement("button");
                    editButton.className = "editButton";
                    editButton.type = "button";
                    editButton.textContent = "Edit";
                    editButton.dataset.action = "edit";

                    action.appendChild(editButton);
                    action.appendChild(delButton);
                    tBubble.appendChild(action);

                }
                list.appendChild(optionsRow);

            }

            list.scrollTop = list.scrollHeight;
        }

        if (count){
            let n = items.length;
            count.textContent = n + " message" + (n===1 ? "" : "s");
        }
    }

    if (form){
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!input) return;
            let text = String(input.value || "").trim();
            if(!text) return
            if(typeof onSend === "function") onSend(text);
            input.value = "";

        });


    }



    if (exptButton){
        exptButton.addEventListener("click", function () {
            if (typeof onExport === "function") onExport();
        });
    }

    /**
     * Event handler for import button click.
     * Opens file picker and reads JSON file contents.
     */
    if (impButton){
        impButton.addEventListener("click", function () {
            let picker = d.createElement("input");
            picker.type = "file";
            picker.accept = "application/json";
            picker.addEventListener("change", function () {
                let file = picker.files && picker.files[0];
                if (!file) return;
                let reader = new FileReader();
                reader.onload = function () {
                    if (typeof onImport === "function") {
                        onImport(String(reader.result || ""));
                    }
                };
                reader.readAsText(file);
            });
            picker.click();
        });
    }

    /**
     * Event handler for clear button click.
     * Confirms before triggering onClear callback.
     */
    if (clrButton){
        clrButton.addEventListener("click", function () {
            if (confirm("Clear all messages?")) {
                if (typeof onClear === "function") onClear();
            }
        });
    }

    /**
     * Event handler for message list clicks.
     * Handles edit/delete button clicks on user messages.
     */
    if (list) {
        list.addEventListener("click", function (e) {
            const btn = e.target.closest("button");
            if (!btn) return;

            const action = btn.dataset.action;
            if (!action) return;

            const row = btn.closest("message-row");

            if (!row || !row.dataset.id) return;
            const id = row.dataset.id;

            if (action === "edit" && typeof onEdit === "function")  onEdit(id);
            if (action === "delete" && typeof onDelete === "function") onDelete(id);
        });
    }

    return{
        render: render,
        set onSend(fn)   { onSend = fn;   },
        set onExport(fn) { onExport = fn; },
        set onImport(fn) { onImport = fn; },
        set onClear(fn)  { onClear = fn;  },
        set onEdit(fn)   { onEdit = fn;   },
        set onDelete(fn) { onDelete = fn; }
    };

}