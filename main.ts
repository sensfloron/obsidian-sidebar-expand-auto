import { log } from 'console';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { env } from 'process';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	openLeftSetting: boolean;
	openRightSetting: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	openLeftSetting: true,
	openRightSetting: true
}
const ExpandAutoStatus = {
	leftIsAutoOpen: false,
	rightIsAutoOpen: false
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'mousemove', (evt: MouseEvent) => {
			// console.log('mousemove', evt.pageX);
			let x = evt.pageX;
			let leftBorder = 40;
			let leftSidebarWidth = 334;
			let rightBorder = 1480;

			if (x < leftBorder) {
				console.log('左侧展开')
				// TODO 将侧边栏展开
				ExpandAutoStatus.leftIsAutoOpen = true;
			}
			if (x > leftSidebarWidth && ExpandAutoStatus.leftIsAutoOpen) {
				// TODO 将侧边栏收起
				console.log('左侧收起')
				ExpandAutoStatus.leftIsAutoOpen = false;
			}
			if (x > rightBorder) {
				console.log('右侧展开')
				ExpandAutoStatus.leftIsAutoOpen = true;
			}
			if (x > leftSidebarWidth && ExpandAutoStatus.leftIsAutoOpen) {
				// TODO 将侧边栏收起
				console.log('右侧收起')
				ExpandAutoStatus.leftIsAutoOpen = false;
			}
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

function throttle<T extends (...args: any[]) => void>(callback: T, delay: number): T {
	let timerId: ReturnType<typeof setTimeout> | null;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (!timerId) {
			timerId = setTimeout(() => {
				callback.apply(this, args);
				timerId = null;
			}, delay);
		}
	} as T;
}


class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('自动展开左侧边栏')
			.setDesc('')
			.addButton(val => val.onClick(async (isOpen) => {
				this.plugin.settings.openLeftSetting = false
			}));

		new Setting(containerEl)
			.setName('自动展开右侧边栏')
			.setDesc('')
			.addButton(val => val.onClick(async (isOpen) => {
				this.plugin.settings.openRightSetting = false
			}));

		// .addText(text => text
		// 	.setPlaceholder('Enter your secret')
		// 	.setValue(this.plugin.settings.mySetting)
		// 	.onChange(async (value) => {
		// 		this.plugin.settings.mySetting = value;
		// 		await this.plugin.saveSettings();
		// 	}));
	}
}
