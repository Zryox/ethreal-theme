class CustomTheme {   
    constructor(themes) {
        MegaMod.log("Initializing Mod:", "Custom Theme");

        this.themes = themes;
        this.themes.forEach(theme => {
            theme.url = theme.url || `/themes/css/${theme.id}.css`;
            const preload = unsafeWindow.megaMod.modSettingEnabled("themeManager_preload", true);
            const style = document.createElement(preload ? 'style' : 'link');
            style.id = `themeCSS-${theme.id}`;
            const disabled = !(unsafeWindow.megaMod.modSettingEnabled("themeManager") && theme.id === unsafeWindow.megaMod.getModSettingById("themeManager_themeSelect").value);
            if (preload) {
                MegaMod.fetchCSS(theme.url)
                    .then(css => {
                        document.body.appendChild(style).textContent = css;
                        style.disabled = disabled;
                    });
            } else {
                Object.assign(style, { rel: 'stylesheet', href: (cdnPath + theme.url), disabled: disabled });
                document.body.appendChild(style);
            }
        });
    }

    onThemeChanged(enabled, themeId) {
        this.themes.forEach(theme => document.getElementById(`themeCSS-${theme.id}`).disabled = !enabled || theme.id !== themeId);
        this.setThemeDesc();
    }
    
    setThemeDesc() {
        const themeDescInterval = setInterval(() => {
            if (!document.getElementById('themeDesc')) return;
            clearInterval(themeDescInterval);
            document.getElementById('themeDesc').innerHTML = vueApp.loc[this.themes.find(t => t.id === unsafeWindow.megaMod.getModSettingById('themeManager_themeSelect').value).locKey];
        }, 50);
    }
}