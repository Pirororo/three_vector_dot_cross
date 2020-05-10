// import App from './App.js';//動かない
import {App} from './App.js';//{}なぜないとだめ？→export時にdefaultがないため、{}の中で何をimportすればよいのか指定する必要があるため

import Scene from './scene/scene.js';//{}なぜあるとだめ？

new App(new Scene());