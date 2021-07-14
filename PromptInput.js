import { html, css, LitElement } from 'lit';

export function openPromptInput(label) {
    let promptComponent = document.createElement('prompt-input');
    promptComponent.label = label;
    document.body.append(promptComponent);
    return promptComponent.response;
}

export class PromptInput extends LitElement {
    static get styles() {
        return css``;
    }

    static get properties() {
        return {
            label: {type: String}
        }
    }

    get promptForm() {
        return this.shadowRoot.querySelector('#promptForm');
    }

    constructor() {
        super();
        this.createResponse();
    }

    createResponse() {
        this.response = new Promise((resolve, reject) => {
            this._resolveResponse = (...params) => {
                resolve(...params);
            };
            this._cancelResponse = (...params) => {
                reject(...params);
            };
        });
    }

    handleResponse(e) {
        let data = new FormData(this.promptForm);
        this._resolveResponse?.(Object.fromEntries([...data.entries()]));
        this._resolveResponse = undefined;
        this._cancelResponse = undefined;
        this.remove();
    }

    handleCancel() {
        this._cancelResponse?.();
        this._resolveResponse = undefined;
        this._cancelResponse = undefined;
        this.remove();
    }

    render() {
        return html`
        <dynamic-modal open>
            <form id="promptForm" @submit="${this.handleResponse}">
                <div style="padding: 2rem">
                    <label style="display:block">${this.label}</label>
                    <input type="text" name="name" />
                </div>
                <div style="background-color: rgb(209,213,219); padding: 1rem 2rem; display: flex; justify-content: space-between">
                    <button type="button" @click="${this.handleCancel}">Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </dynamic-modal>
        `;
    }
}
if(!customElements.get('prompt-input'))
    customElements.define('prompt-input', PromptInput);