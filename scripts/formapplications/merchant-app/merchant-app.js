import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';
import ItemPileConfig from "../item-pile-config/item-pile-config";
import MerchantAppShell from "./merchant-app.svelte";

export default class MerchantApp extends SvelteApplication {

    constructor(merchant, buyer = false, options, dialogData) {
        merchant = merchant?.actor ?? merchant
        buyer = buyer?.actor ?? buyer
        super({
            id: `merchant-app-${merchant.id}-${buyer?.id ?? ""}`,
            title: `Merchant: ${merchant.name}`,
            svelte: {
                class: MerchantAppShell,
                target: document.body,
                props: {
                    merchant,
                    buyer
                }
            },
            ...options
        }, dialogData);
        this.merchant = merchant?.actor ?? merchant;
    }

    static async show(merchant, buyer = false, options = {}, dialogData = {}) {
        return new Promise((resolve) => {
            options.resolve = resolve;
            new this(merchant, buyer, options, dialogData).render(true, { focus: true });
        })
    }

    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["app window-app sheet", "item-piles-merchant-sheet"],
            width: 800,
            height: 700,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-body", initial: "description" }],
            closeOnSubmit: false,
            resizable: true
        });
    }

    /** @override */
    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        const canConfigure = game.user.isGM;
        if (canConfigure) {
            buttons = [
                {
                    label: "ITEM-PILES.Inspect.OpenSheet",
                    class: "item-piles-open-actor-sheet",
                    icon: "fas fa-user",
                    onclick: () => {
                        this.merchant.sheet.render(true, { focus: true });
                    }
                },
                {
                    label: "ITEM-PILES.HUD.Configure",
                    class: "item-piles-configure-pile",
                    icon: "fas fa-box-open",
                    onclick: () => {
                        ItemPileConfig.show(this.merchant);
                    }
                },
            ].concat(buttons);
        }
        return buttons
    }

}