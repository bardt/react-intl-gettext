import fs from 'fs';
import PO from 'pofile';
import readdir from 'recursive-readdir'

export function getPODate(date) {
    // 2015-09-24 17:15+0600
    let dateString = date.toISOString().substr(0,10);
    // @TODO Finish date genearation
    return `${dateString}`
}

export function getHeaders() {
    return {
        "POT-Creation-Date": getPODate(new Date()),
        "PO-Revision-Date": "YEAR-MO-DA HO:MI+ZONE",
        "Last-Translator": "FULL NAME <EMAIL@ADDRESS>",
        "Language-Team": "LANGUAGE <LL@li.org>",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Transfer-Encoding": "8bit"
    };
}

export function getItems(jsonFiles) {
    return jsonFiles.reduce((accum, jsonFile) => {
        const json = require(jsonFile);
        console.log(json);
        const poItems = json.map((jsonMessage) => {
            const poItem = new PO.Item();
            poItem.msgid = jsonMessage.defaultMessage;
            poItem.comments = [jsonMessage.id];
            poItem.extractedComments = [jsonMessage.description];
            return poItem;
        });

        return [...accum, ...poItems];
    }, []);
}

export function intl2pot(config = {}) {
    const defaultConfig = {
        src: './path/to/json/sources/folder/',
        dest: './some/po/file/path.po'
    };

    const realConfig = {
        ...defaultConfig,
        ...config
    };

    console.log('config', JSON.stringify(realConfig, null, 4));

    const basePath = process.cwd();

    readdir(`${basePath}/${realConfig.src}`, (err, files) => {
        const poFile = new PO();

        poFile.headers = getHeaders();

        const jsonFiles = files.filter(fileName => fileName.endsWith('.json'));
        poFile.items = getItems(jsonFiles);

        poFile.save(realConfig.dest, (err) => {
            if (err) {
                console.log('Error: ', err);
            } else {
                console.log('Done');
                process.exit();
            }
        })
    });
}

export function po2intl(config = {}) {
    const defaultConfig = {
        src: './some/po/file/path.po',
        dest: './some/json/output/path.json'
    };

    const realConfig = {
        ...defaultConfig,
        ...config
    };

}
