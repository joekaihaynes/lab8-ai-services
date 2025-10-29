/**
 * Creates a Model instance for managing chat messages with localStorage persistence.
 * @returns {Object} Model API with CRUD operations and import/export functionality.
 */

const KEY = "joelab7";

export function Model() {
    let messages = [];
    let onChange =null;

    /**
     * Generates a unique ID for messages using timestamp + random string.
     * @returns {string} Unique identifier.
     */
    function makeUID(){
        return Date.now().toString() + Math.random().toString(36).slice(2, 8);
    }

    /**
     * Notifies subscribers of state changes by calling the onChange callback.
     * Returns a shallow copy of messages to prevent external mutation.
     */
    function change(){
        if (typeof onChange === "function") {
            onChange({ messages: messages.slice() });
        }
    }

    /**
     * Loads messages from localStorage on initialization.
     * Resets to empty array if parsing fails.
     */
    function load() {
        try{
            let labKey = localStorage.getItem(KEY);
            messages = labKey ? JSON.parse(labKey) : [];
        } catch(e) {
            messages = [];
        }
        change();
    }

    /**
     * Saves current messages to localStorage and triggers change notification.
     */
    function save() {
        localStorage.setItem(KEY, JSON.stringify(messages));
        change();
    }

    /**
     * Adds a new message to the chat history.
     * @param {string} text - Message content.
     * @param {string} role - Message role ("user" or "bot").
     * @returns {Object} The added message object.
     */
    function addText( text, role){
        let msg ={
            id: makeUID(),
            text: String(text),
            role : role,
            time : new Date().toISOString(),
            edited: false
        }
        messages.push(msg);
        save();
        return msg;
    }

    /**
     * Updates the text of an existing message by ID.
     * @param {string} id - Message ID.
     * @param {string} newText - New message content.
     * @returns {boolean} True if updated, false if not found.
     */
    function updateText(id, newText) {
        let msg = messages.find(m => m.id === id);
        if (!msg) return false;
        msg.text = String(newText || "");
        msg.edited = true;
        save();
        return true;
    }

    /**
     * Removes a message by ID.
     * @param {string} id - Message ID.
     * @returns {boolean} True if deleted, false if not found.
     */
    function deleteText(id) {
        let before = messages.length;
        messages = messages.filter(m => m.id !== id);
        if (messages.length === before) return false;
        save();
        return true;
    }

    /**
     * Clears all messages from the chat history.
     */
    function clearText(){
        messages = [];
        save();
    }

    /**
     * Exports messages as pretty-printed JSON string.
     * @returns {string} JSON representation of messages.
     */
    function exportJSON(){
        return JSON.stringify(messages, null, 2);
    }

    /**
     * Imports messages from JSON string, validating structure.
     * Only accepts arrays with valid user/bot messages.
     * @param {string} text - JSON string containing messages.
     * @returns {boolean} True if import successful, false otherwise.
     */
    function importJSON(text){
        try {
            let textChain = JSON.parse(text);
            if (!Array.isArray(textChain)) {
                return false;
            }
            messages = textChain.filter(function(m){
                return m && typeof m.text === "string" &&
                    (m.role === "user" || m.role === "bot");
            });
            save();
            return true;
        }catch(e){
            return false;
        }
    }

    load();

    return {
        /**
         * Sets the change callback function and triggers initial update.
         * @param {function} fn - Callback receiving { messages: array }.
         */
        setOnChange: function (fn) { onChange = fn; change(); },
        // crud
        add: addText,
        update: updateText,
        remove: deleteText,
        clear: clearText,
        // import/export
        exportJSON: exportJSON,
        importJSON: importJSON
    };
}



