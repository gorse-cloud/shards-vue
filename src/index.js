import * as components from './components'
import * as directives from './directives'
import { vueUse } from './utils'
import { installEventBus } from './utils/events'

const VuePlugin = {
  install: function (app) {
    if (app._shards_vue_installed) {
      return
    }

    app._shards_vue_installed = true
    installEventBus(app)

    // Register component plugins
    for (let component in components) {
      app.use(components[component])
    }

    // Register directive plugins
    for (let directive in directives) {
      app.use(directives[directive])
    }
  }
}

vueUse(VuePlugin)

export default VuePlugin
