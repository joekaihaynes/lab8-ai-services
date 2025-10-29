/**
 * Controller for managing the chatbot interface, connecting the model and view layers.
 * Handles user interactions and updates the application state accordingly.
 * @param {Object} model - The model instance managing chat state and data.
 * @param {Object} view - The view instance responsible for rendering the UI.
 * @returns {void}
 */


import { getBotResponse } from "./eliza.js";

export function Controller (model, view) {

    /**
     * Sets up the model change listener to automatically update the view when state changes.
     */
    model.setOnChange(function(state) {
        view.render(state);
    });

    /**
     * Handles sending a user message and getting bot response.
     * Adds user message to model, gets bot reply, and adds it to model.
     * @param {string} text - The user's input message.
     */
    view.onSend = function(text){
        model.add(text, "user");
        let reply = getBotResponse(text);
        model.add(reply, "bot");
    }

    /**
     * Exports the current chat history as a JSON file and triggers download.
     * Creates a blob with JSON data and simulates a download link click.
     */
    view.onExport = function(){
        let jsonText = model.exportJSON();
        let chatBlob = new Blob([jsonText], {type: "application/json"});
        let url = URL.createObjectURL(chatBlob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "textExport.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Imports chat data from provided JSON text.
     * Shows alert if import fails.
     * @param {string} text - JSON text containing chat data to import.
     */
    view.onImport = function(text){
        let importText = model.importJSON(text);
        if(!importText){
            alert("Import text not found.");
        }

    }

    /**
     * Edits an existing message by prompting user for new text.
     * @param {string|number} id - The identifier of the message to edit.
     */
    view.onEdit = function(id){
        let newText = prompt("Edit your message: ");
        if(!newText) return;
        model.update(id, newText);
    }

    /**
     * Deletes a message after user confirmation.
     * @param {string|number} id - The identifier of the message to delete.
     */
    view.onDelete = function(id){
        if(!confirm("Are you sure you want to delete?")) return;
        model.remove(id);
    }

    /**
     * Clears all chat messages from the model.
     */
    view.onClear = function(){
        model.clear();
    }
}