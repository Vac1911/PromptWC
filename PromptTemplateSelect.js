import { html, css, LitElement } from 'lit';
import { TemplateSelect } from '@/LayoutBuilder/Component/TemplateSelect';
import { DynamicModal } from '@/LayoutBuilder/Component/DynamicModal';

export function openPromptTemplateSelect() {
    let promptComponent = document.createElement('prompt-template');
    document.body.append(promptComponent);
    return promptComponent.response;
}

export class PromptTemplate extends LitElement {
    static get styles() {
        return css`
            .wrapper {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-height: 75vh;
            }
            #promptForm {
                overflow-y: overlay;
                background-color: transparent;
                padding-left: 0;
            }
        `;
    }

    static get properties() {
        return {
            templateId: {type: String}
        }
    }

    get promptForm() {
        return this.shadowRoot.querySelector('#promptForm');
    }

    constructor() {
        super();
        this.createResponse();
        this.templateId = '';
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
        this._resolveResponse?.(this.promptForm.templates.find(t => t.id === this.templateId));
        this._resolveResponse = undefined;
        this._cancelResponse = undefined;
        this.remove();
    }

    handleCancel() {
        this._resolveResponse?.(null);
        this._resolveResponse = undefined;
        this._cancelResponse = undefined;
        this.remove();
    }

    render() {
        return html`
        <dynamic-modal open>
            <div class="wrapper">
                ${this.templateId}
                <template-select id="promptForm" maxItemHeight="10vh" @selected="${({detail}) => this.templateId = detail}" open></template-select>
                <div style="display: flex; justify-content: space-between">
                    <button part="btn btn-secondary" type="button" @click="${this.handleCancel}">Cancel</button>
                    <button part="btn btn-primary" type="button" @click="${this.handleResponse}">Ok</button>
                </div>
            </div>
        </dynamic-modal>
        `;
    }
}
if(!customElements.get('prompt-template'))
    customElements.define('prompt-template', PromptTemplate);