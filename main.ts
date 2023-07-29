import { log } from 'console';
import { createDiffieHellmanGroup } from 'crypto';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
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
	rightIsAutoOpen: false,
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;


	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'mousemove', this.throttledMouseMoveHandler);

	}

	onunload() {

	}
	getFileViewWidth(): any {
		// 获取当前的 WorkspaceLeaf 对象，它表示当前的视图
		const leaf = this.app.workspace.getLeaf();

	}

	throttledMouseMoveHandler = throttle((evt: MouseEvent) => {

		let x = evt.pageX;
		let y = evt.pageY;

		let topBorder = 40;
		let leftBorder = 40;
		let rightBorder = 1940;
		// 左侧收起坐标
		let leftSidebar = 550;
		// 右侧收起坐标
		let rightSidebar = 1600;


		console.log(evt.pageX, evt.pageY);
		if (y > topBorder) {
			if (x < leftBorder && !ExpandAutoStatus.leftIsAutoOpen) {
				// 鼠标x小于40了，未自动展开
				this.app.workspace.leftSplit.toggle()
				ExpandAutoStatus.leftIsAutoOpen = true;
			}
			else if (x > leftSidebar && ExpandAutoStatus.leftIsAutoOpen) {
				// 鼠标处于收起坐标且正在自动展开， 收起面板
				this.app.workspace.leftSplit.toggle();
				ExpandAutoStatus.leftIsAutoOpen = false;
			}
		}
		if (y < topBorder) {
			if (x > rightBorder && !ExpandAutoStatus.rightIsAutoOpen) {
				// 鼠标到达最右侧未自动展开，且在顶栏
				console.log('右侧展开')
				this.app.workspace.rightSplit.toggle();
				ExpandAutoStatus.rightIsAutoOpen = true;
			}
			else if (x < rightSidebar && ExpandAutoStatus.rightIsAutoOpen) {
				// 鼠标处于收起坐标正在自动展开且在顶栏 收起面板
				console.log('右侧收起')
				this.app.workspace.rightSplit.toggle();
				ExpandAutoStatus.rightIsAutoOpen = false;
			}
		}
	}, 10);

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

/**
 *
 * @param direction 左边是 true，右边是false
 * @returns
 */
// function getFileViewWidth(direction: boolean): any {
// 	let n = (direction) ? 'left' : 'right';
// 	// 获取当前的 WorkspaceLeaf 对象，它表示当前的视图
// 	const activeLeaf = this.app.workspace.activeLeaf;

// 	// 判断当前视图是否是左侧边栏
// 	if (activeLeaf && activeLeaf.getContainer() === n) {
// 		// 获取左侧边栏的 DOM 元素
// 		const leftSidebarEl = activeLeaf.view.containerEl;

// 		// 获取左侧边栏的离左边缘的 X 坐标
// 		const leftX = leftSidebarEl.getBoundingClientRect().left;
// 		return leftX;
// 	}
// }
