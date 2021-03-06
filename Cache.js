// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
class Cache {
    constructor(name) {
        this.fm = FileManager.local();
        this.cachePath = this.fm.joinPath(this.fm.documentsDirectory(), name);

        if (!this.fm.fileExists(this.cachePath)) {
            this.fm.createDirectory(this.cachePath);
        }
    }

    read = async (key, expirationHours) => { // TODO: Add option for cache to never expire
        try {
            const path = this.fm.joinPath(this.cachePath, key);
            const createdAt = this.fm.creationDate(path);

            if (expirationHours) {
                if ((new Date()) - createdAt > (expirationHours * 3_600_000)) {
                    this.fm.remove(path);
                    return {};
                }
            }

            const value = this.fm.readString(path);

            try {
                if (null == value) {
                    return {}
                }

                return JSON.parse(value);
            } catch (error) {
                return value;
            }
        } catch (error) {
            return {};
        }
    }

    write = (key, value) => {
        const path = this.fm.joinPath(this.cachePath, key.replace('/', "-"));
        console.log(`Caching to ${path}...`);

        if (typeof value === "string" || value instanceof String) {
            this.fm.writeString(path, value);
        } else {
            this.fm.writeString(path, JSON.stringify(value));
        }
    }

    readExpiryData = (key) => {
        // TODO: Load data and check if data timed out, if so delete it and remove nothing
    }

    writeExpiryData = (key, value, expiryTime) => {
        // TODO: Store data to cache with time to live to file
    }
}

module.exports = Cache;
