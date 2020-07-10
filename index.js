require('dotenv').config();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const config = require('./config.js');
const fs = require('fs');
const Client = require('ssh2-sftp-client');
const unzipper = require('unzipper');

(async () => {
    console.log('Starting browser emulator...');

    // make browser seem as "legit" as possible
    // https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth

    puppeteer.use(StealthPlugin())


    const browser = await puppeteer.launch({headless: config.headless, args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']});
    //const browser = await puppeteer.launch({ headless: config.headless });

    const page = await browser.newPage();

    // uncomment to test bypass
    // await page.goto('https://bot.sannysoft.com')
    // await page.waitFor(5000)
    // await page.screenshot({ path: 'testresult.png', fullPage: true })
    // await browser.close()
    // console.log(`All done, check the screenshot.`)


    let versions = {};
    if(fs.existsSync('versions.json')) {
        versions = JSON.parse(fs.readFileSync('versions.json'));
        console.log('Loaded versions.json');
    } else {
        console.log('versions.json not found, creating!')
        fs.writeFileSync('versions.json', '{}');
    }
    if(!fs.existsSync('./plugins')) {
        console.log('Plugins directory not found, creating!');
        fs.mkdirSync('./plugins');
    }
    if(!fs.existsSync('./downloads')) {
        console.log('Downloads directory not found, creating!');
        fs.mkdirSync('./downloads');
    } else {
        console.log('Empying downloads directory...');
        for(const file of fs.readdirSync('./downloads')) {
            fs.unlinkSync('./downloads/' + file);
        }
    }

    // allow for file downloads, and put them in the download folder
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './downloads'});


    // Step 1: log into spigotmc
    console.log('Logging into spigotmc...')
    await page.goto('https://www.spigotmc.org/login');
    //await page.screenshot('./loaded.png');
    await page.type('#ctrl_pageLogin_login', config.spigot_login.email);
    await page.keyboard.press('Tab');
    await page.keyboard.type(config.spigot_login.password);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    //await page.screenshot({ path: 'testresult.png', fullPage: true })
    await page.waitForNavigation();

    // Step 2: iterate through plugins and download updates
    console.log('Checking for plugin updates...');
    for(const plugin in plugins) {
        console.log(`Checking ${plugin}...`);

        // handle spigot plugin
        if(plugins[plugin].type === 'spigot') {
            await page.goto(plugins[plugin].url);
            const downloadURL = await page.evaluate(() => document.querySelector('.downloadButton > a').href);
            if(downloadURL !== undefined) {
                console.log(`Download url: ${downloadURL}`);
                if(versions[plugin] !== downloadURL) {
                    console.log(`Found new version of ${plugin}! Starting download...`);
                    try {
                        await page.goto(downloadURL);
                    } catch(e) {
                        // sometimes there is an error but it doesn't actually impact downloading
                        // the browser freaks out because it doesn't know how to display a jar file
                        // console.log(e);
                    }
                    await page.waitFor(config.plugin_download_time);
    
                    // move plugin to plugins folder and give it the proper name
                    const downloads = fs.readdirSync('./downloads');
                    if(downloads.length === 0) {
                        console.log(`ERROR: Could not download plugin from ${downloadURL}`)


                    // unzipping logic
                    } else if (downloads[0].toLowerCase().endsWith('.zip')) {
                        if(plugins[plugin].zip_jar_name === undefined) {
                            console.log(`ERROR: Plugin ${plugin} downloaded as a zip archive, but 'zip_jar_name' is not defined!`);
                        } else {
                            console.log(`Unzipping ${downloads[0]}...`);

                            // unzip files, only save correct one
                            const zip = fs.createReadStream('./downloads/' + downloads[0]).pipe(unzipper.Parse({forceStream: true}));
                            for await (const entry of zip) {
                                
                                // if the desired jar file is in a directory, only consider the actual name
                                const fileName = entry.path.split('/').pop();
                                const type = entry.type; // 'Directory' or 'File'
                                if (type === 'File' && fileName.startsWith(plugins[plugin].zip_jar_name)) {
                                  entry.pipe(fs.createWriteStream('./plugins/' + plugins[plugin].jar));
                                  versions[plugin] = downloadURL;
                                } else {
                                  entry.autodrain();
                                }
                              }

                            // delete zip archive
                            fs.unlinkSync('./downloads/' + downloads[0]);
                        }

                    } else {
                        versions[plugin] = downloadURL;
                        fs.renameSync('./downloads/' + downloads[0], './plugins/' + plugins[plugin].jar);
                    }
                } else {
                    console.log(`${plugin} is up to date`);
                }
            } else {
                console.log(`Could not find download url for ${plugin}!`)
            }

        // handle direct plugin
        } else if (plugins[plugin].type === 'direct') {
            const downloadURL = plugins[plugin].url;
            console.log(`Downloading from ${downloadURL}`);
            try {
                await page.goto(downloadURL);
            } catch(e) {
                // sometimes there is an error but it doesn't actually impact downloading
                // the browser freaks out because it doesn't know how to display a jar file
                // console.log(e);
            }
            await page.waitFor(config.direct_plugin_download_time);
            const downloads = fs.readdirSync('./downloads');
            if(downloads.length === 0) {
                console.log(`ERROR: Could not download plugin from ${downloadURL}`);

            // handle unzipping logic
            } else if (downloads[0].toLowerCase().endsWith('.zip')) {
                if(plugins[plugin].zip_jar_name === undefined) {
                    console.log(`ERROR: Plugin ${plugin} downloaded as a zip archive, but 'zip_jar_name' is not defined!`);
                } else {
                    console.log(`Unzipping ${downloads[0]}...`);

                    // unzip files, only save correct one
                    const zip = fs.createReadStream('./downloads/' + downloads[0]).pipe(unzipper.Parse({forceStream: true}));
                    for await (const entry of zip) {
                        
                        // if the desired jar file is in a directory, only consider the actual name
                        const fileName = entry.path.split('/').pop();
                        const type = entry.type; // 'Directory' or 'File'
                        if (type === 'File' && fileName.startsWith(plugins[plugin].zip_jar_name)) {
                          entry.pipe(fs.createWriteStream('./plugins/' + plugins[plugin].jar));
                        } else {
                          entry.autodrain();
                        }
                      }

                    // delete zip archive
                    fs.unlinkSync('./downloads/' + downloads[0]);
                }
            } else {
                fs.renameSync('./downloads/' + downloads[0], './plugins/' + plugins[plugin].jar);
            }     
        } else {
            console.log(`Error in config file: ${plugins[plugin].type} is not a supported plugin type!`);
        }

    }
    await browser.close();

    // save new version info
    console.log('Saving updated version info...')
    fs.writeFileSync('versions.json', JSON.stringify(versions));

    // step 3: upload files via sftp
    const plugins = config.plugins;
    const servers = config.servers;

    for(const server in servers) {
        console.log(`Uploading plugins to ${server}...`);
        const sftp = new Client();

        // connect to server and change to plugins directory
        sftp.connect(servers[server].connection_info).then(() => {
            console.log(`Connected to ${server}`);
            (async () => {
                for(plugin of servers[server].plugins) {
                    console.log(`Uploading ${plugin} to ${server}...`);
                    if(fs.existsSync('./plugins/' + plugins[plugin].jar)) {
                        await sftp.put('./plugins/' + plugins[plugin].jar, servers[server].plugins_dir + plugins[plugin].jar).then(() => {
                            //console.log(`Finished uploading ${plugin} to ${server}`)
                        }).catch((e) => console.error(e));
                    } else {
                        console.log(`Could not find ./plugins/${plugins[plugin].jar}! Skipping...`);
                    }
                }
                console.log(`!!!!Uploading done for ${server}`);
                sftp.end();
            })().catch((e) => console.error(e));
        }).catch((e) => console.error(e));
    }
  })().catch((e) => console.error(e));
