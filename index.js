import { initializeServer } from "./core/client.js";
import { MusicModule } from "./modules/music/index.js";

initializeServer().then(server => {
    const LOAD_SPLASH = process.argv[2] === 'load';
    const RESET_SPLASH = process.argv[2] === 'reset';
    
    switch (true) {
        case LOAD_SPLASH:
            server.loadModule(MusicModule);
            server.loadSlashCommands();
            break;
        case RESET_SPLASH:
            server.resetSlashCommands();
            break;
        default:
            server.start();
            break;
    }
})
