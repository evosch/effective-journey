class IntlNumberFormat extends HTMLDataElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const number = parseFloat(this.getAttribute("value"));
        if (isNaN(number)) {
            console.warn("Invalid number format in 'value' attribute.");
            return;
        }
        
        const locale = this.getAttribute("locale") || navigator.language;
        const options = {
            style: this.getAttribute("style") || "decimal",
            currency: this.getAttribute("currency") || "USD",
        };

        if (options.style === "currency" && !this.hasAttribute("currency")) {
            console.warn("Currency style requires a 'currency' attribute.");
        }

        const formattedNumber = new Intl.NumberFormat(locale, options).format(number);
        this.textContent = formattedNumber;
    }
}

customElements.define("intl-numberformat", IntlNumberFormat, { extends: "data" });
