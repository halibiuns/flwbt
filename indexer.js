const fs = require('fs');
const path = require('path');

const IGNORE = ['.git', 'node_modules']

function generateIndexHtml(dirPath) {
    const items = fs.readdirSync(dirPath).filter((item) => {
        return IGNORE.every((ignore) => {
            return !item.includes(ignore)
        }) && (
            fs.lstatSync(path.join(dirPath, item)).isDirectory() ||
            item.includes('.html')
        ) && item !== 'index.html'
    });
    const links = items.map(item => {
        const itemPath = path.join(dirPath, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        const href = isDirectory ? `${item}/` : `./${item}`;
        return `<li><a href="${href}">${item}</a></li>`;
    }).join('\n');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Directory Listing of ${dirPath}</title>
    </head>
    <body>
        <h1>Directory Listing of ${dirPath}</h1>
        <ul>
            ${links}
        </ul>
    </body>
    </html>
    `;

    fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf8');
}

function traverseDirectory(dirPath) {
    generateIndexHtml(dirPath);

    const items = fs.readdirSync(dirPath).filter((item) => {
        return IGNORE.every((ignore) => {
            return !item.includes(ignore)
        })
    });
    items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            traverseDirectory(itemPath);
        }
    });
}

const targetDir = process.argv[2] || './';

traverseDirectory(targetDir);