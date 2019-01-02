/**
 * Created by jakubniezgoda on 03/03/2017.
 */

class JsonUtils {
    static stringify(value, indented = false, ignoreEmpty = false) {
        if (!ignoreEmpty && _.isEmpty(value)) {
            return '';
        }

        let stringifiedValue = value;
        try {
            stringifiedValue = JSON.stringify(value, null, indented ? 2 : 0);
        } catch (e) {
            console.error(`无法解析 ${value}的值. `, e);
        }

        return _.trim(stringifiedValue, '"');
    }

    // Attempts to parse string to json.
    // Returns original value if failed
    static stringToJson(value) {
        try{
            return JSON.parse(value);
        } catch (err) {
            return value;
        }
    }

}

Stage.defineCommon({
    name: 'JsonUtils',
    common: JsonUtils
});