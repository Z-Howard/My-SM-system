import { defineStore } from "pinia"

export const useSettingStore = defineStore("setting", {
	state: () => ({
		theme: "classic",  // classic, topb
	}),
	getters: {
		getTheme() {
			return this.theme
		},
	},
	actions: {
		setTheme(theme: String) {
			this.theme = theme
		},
	},
})