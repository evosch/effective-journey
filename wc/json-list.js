class JsonList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data') {
            this.render();
        }
    }

    get data() {
        try {
            return JSON.parse(this.getAttribute('data')) || [];
        } catch (e) {
            console.error('Invalid JSON data', e);
            return [];
        }
    }

    get template() {
        return this.querySelector('template');
    }

    render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = '';
        const list = document.createFragment();
        const template = this.template ? this.template.content : null;

        if (!template) return;

        this.data.forEach(item => {
            const instance = document.importNode(template, true);

            Object.keys(item).forEach(key => {
                const slot = instance.querySelector(`[property="${key}"]`);
                if (slot) slot.textContent = item[key];
            });

            list.appendChild(instance);
        });

        this.shadowRoot.appendChild(list);
    }
}

customElements.define('json-list', JsonList);
