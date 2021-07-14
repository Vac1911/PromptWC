import { html, css, LitElement } from 'lit';

export function openPromptConfirm(header, msg) {
    let promptComponent = document.createElement('prompt-confirm');
    promptComponent.header = header;
    promptComponent.msg = msg;
    document.body.append(promptComponent);
    return promptComponent.response;
}

export class PromptConfirm extends LitElement {
    static get styles() {
        return css`
            #heading {
                font-size: 1.5rem;
                font-weight: 500;
                line-height: 1.2;
            }
            #heading, #msg {
                margin-bottom: 1rem;
            }
            #promptForm {
                padding: 1rem;
            }
        `;
    }

    static get properties() {
        return {
            header: {type: String},
            msg: {type: String}
        }
    }

    get promptForm() {
        return this.shadowRoot.querySelector('#promptForm');
    }

    get promptFormData() {
        let data = new FormData(this.promptForm);
        return Object.fromEntries([...data.entries()]);
    }

    constructor() {
        super();
        this.createResponse();
        this.header = '';
        this.msg = '';
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

        this._resolveResponse?.(true);
        this._resolveResponse = undefined;
        this._cancelResponse = undefined;
        this.remove();
    }

    handleCancel() {
        this._resolveResponse?.(false);
        this._resolveResponse = undefined;
        this._cancelResponse = undefined;
        this.remove();
    }

    render() {
        return html`
        <dynamic-modal width="32rem" open>
            <form id="promptForm" @submit="${this.handleResponse}">
                <div id="heading">
                    ${this.header}
                </div>
                <div id="msg">
                    ${this.msg}
                </div>
                <div style="display: flex; justify-content: space-between">
                    <button part="btn btn-secondary" type="button" @click="${this.handleCancel}">Cancel</button>
                    <button part="btn btn-primary" type="submit">Ok</button>
                </div>
            </form>
        </dynamic-modal>
        `;
    }
}
if(!customElements.get('prompt-confirm'))
    customElements.define('prompt-confirm', PromptConfirm);