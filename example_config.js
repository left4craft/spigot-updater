// RENAME THIS FILE TO CONFIG.JS AFTER YOU FINISH EDITING

module.exports = {
    // time to wait for each plugin to download, in ms
    // note: this should be 5 seconds for cloudflare + time you think it will take to download
    // recommended: 15 seconds for decent internet connection
    plugin_download_time: 15000,


    // enter username and password for spigotmc, used for downloading premium resources
    // 2fa currently not supported
    spigot_login: {
        email: 'email',
        password: 'supersecret'
    },

    // list all plugins you wish to be automatically downloaded
    // note: "jar" setting must exactly match the name of the jar file on the remote server
    // it does not matter what the downloaded jar is named by default; it will be renamed
    // by the script. The "jar" setting must also be unique for each plugin.
    plugins: {
        spartan: {
            type: 'spigot',
            url: 'https://www.spigotmc.org/resources/spartan-advanced-anti-cheat-hack-blocker.25638/',
            jar: 'Spartan.jar'
        }
    },

    // list of all servers to which the plugins should be uploaded
    // currently only supports sftp
    // plugins_dir should be an absolute file path, with trailing slash
    // plugins need to be defined here exactly as they are named above
    servers: {
        hub: {
            type: 'sftp',
            connection_info: {
                host: 'ip',
                port: '2022',
                username: 'user',
                password: 'password'
            },
            plugins_dir: 'pass',
            plugins: [
                'spartan'
            ]
        }
    }
}