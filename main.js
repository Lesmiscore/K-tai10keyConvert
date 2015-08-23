var KTai10K = (function () {
    function KTai10K() {
    }
    KTai10K.numberToHiragana = function (num) {
        var read = new StringReadingHelper(num);
        var buf = "";
        var nowNum = read.read();
        var nowCount = 0;
        while (read.peek() !== null) {
            var now = read.read();
            if (nowNum == now) {
                nowCount++;
            }
            else if (nowNum == " ") {
                buf += KTai10K.encodeData[nowNum][nowCount - 1];
                nowNum = read.read();
                nowCount = 1;
            }
            else {
                buf += KTai10K.encodeData[nowNum][nowCount - 1];
                nowNum = read.read();
                nowCount = 1;
            }
        }
        return KTai10K.pack(buf);
    };
    KTai10K.pack = function (text) {
        var read = new StringReadingHelper(text);
        var res = "";
        var ignoreSpecial = false;
        while (read.peek() !== null) {
            var now = read.read();
            if (res == "") {
                res += now;
            }
            else {
                switch (now) {
                    case "(":
                        if (ignoreSpecial) {
                            ignoreSpecial = false;
                            continue;
                        }
                        var last = res.charAt(res.length - 1);
                        res = res.substr(0, res.length - 1);
                        var where1 = -1;
                        var where2 = -1;
                        for (var i in KTai10K.encodeData) {
                            var index = KTai10K.encodeData[i].indexOf(last);
                            if (index != -1) {
                                where1 = i;
                                where2 = index;
                            }
                        }
                        if ((where1 == -1) || (where2 == -1)) {
                            continue;
                        }
                        var shouldReplace = KTai10K.dakuten[where1][where2];
                        if (shouldReplace == "　") {
                            continue;
                        }
                        res += shouldReplace;
                        ignoreSpecial = true;
                        break;
                    case ")":
                        if (ignoreSpecial) {
                            ignoreSpecial = false;
                            continue;
                        }
                        var last = res.charAt(res.length - 1);
                        res = res.substr(0, res.length - 1);
                        var where1 = -1;
                        var where2 = -1;
                        for (var i in KTai10K.encodeData) {
                            var index = KTai10K.encodeData[i].indexOf(last);
                            if (index != -1) {
                                where1 = i;
                                where2 = index;
                            }
                        }
                        if ((where1 == -1) || (where2 == -1)) {
                            continue;
                        }
                        var shouldReplace = KTai10K.handakuten[where1][where2];
                        if (shouldReplace == "　") {
                            continue;
                        }
                        res += shouldReplace;
                        ignoreSpecial = true;
                        break;
                    case "(":
                        if (ignoreSpecial) {
                            ignoreSpecial = false;
                            continue;
                        }
                        var last = res.charAt(res.length - 1);
                        res = res.substr(0, res.length - 1);
                        var where1 = -1;
                        var where2 = -1;
                        for (var i in KTai10K.encodeData) {
                            var index = KTai10K.encodeData[i].indexOf(last);
                            if (index != -1) {
                                where1 = i;
                                where2 = index;
                            }
                        }
                        if ((where1 == -1) || (where2 == -1)) {
                            continue;
                        }
                        var shouldReplace = KTai10K.sutegana[where1][where2];
                        if (shouldReplace == "　") {
                            continue;
                        }
                        res += shouldReplace;
                        ignoreSpecial = true;
                        break;
                    default:
                        if (ignoreSpecial) {
                            ignoreSpecial = false;
                        }
                        res += now;
                        continue;
                }
            }
        }
        return res;
    };
    KTai10K.hiraganaToNumber = function (str) {
        var buf = "";
        var read = new StringReadingHelper(str);
        while (read.peek() !== null) {
            var now = read.read();
            var where1 = -1;
            var where2 = -1;
            var where3 = "";
            for (var i in KTai10K.encodeData) {
                var index = KTai10K.encodeData[i].indexOf(now);
                if (index != -1) {
                    where1 = i;
                    where2 = index;
                    where3 = "default";
                }
            }
            for (var i in KTai10K.dakuten) {
                var index = KTai10K.dakuten[i].indexOf(now);
                if (index != -1) {
                    where1 = i;
                    where2 = index;
                    where3 = "dakuten";
                }
            }
            for (var i in KTai10K.handakuten) {
                var index = KTai10K.handakuten[i].indexOf(now);
                if (index != -1) {
                    where1 = i;
                    where2 = index;
                    where3 = "handakuten";
                }
            }
            if ((where1 == -1) || (where2 == -1) || (where3 == "") || (now == "　")) {
                continue;
            }
            where1++;
            switch (where3) {
                case "default":
                    for (var j = 0; j < (where2 + 1); j++)
                        buf += where1;
                    break;
                case "dakuten":
                    for (var j = 0; j < (where2 + 1); j++)
                        buf += where1;
                    buf += "#";
                    break;
                case "handakuten":
                    for (var j = 0; j < (where2 + 1); j++)
                        buf += where1;
                    buf += "##";
                    break;
            }
        }
        return buf;
    };
    /*
    "(" means "濁点"
    ")" means "半濁点"
    " " means big/small change
    "-" means cancel changing
    */
    KTai10K.encodeData = {
        0: ["わをん"],
        1: ["あいうえお"],
        2: ["かきくけこ"],
        3: ["さしすせそ"],
        4: ["たちつてと"],
        5: ["なにぬねの"],
        6: ["はひふへほ"],
        7: ["まみむめも"],
        8: ["やゆよ"],
        9: ["らりるれろ"],
        "#": ["() -"],
        "*": ["、。？！"],
    };
    KTai10K.dakuten = {
        0: ["　　　"],
        1: ["　　　　　"],
        2: ["がぎぐげご"],
        3: ["ざじずぜぞ"],
        4: ["だぢづでど"],
        5: ["　　　　　"],
        6: ["ばびぶべぼ"],
        7: ["　　　　　"],
        8: ["　　　"],
        9: ["　　　　　"],
        "#": ["　　　　"],
        "*": ["　　　　"],
    };
    KTai10K.handakuten = {
        0: ["　　"],
        1: ["　　　　　"],
        2: ["　　　　　"],
        3: ["　　　　　"],
        4: ["　　　　　"],
        5: ["　　　　　"],
        6: ["ぱぴぷぺぽ"],
        7: ["　　　　　"],
        8: ["　　"],
        9: ["　　　　　"],
        "#": ["　　　　"],
        "*": ["　　　　"],
    };
    KTai10K.sutegana = {
        0: ["ゎ　　"],
        1: ["ぁぃぅぇぉ"],
        2: ["　　　　　"],
        3: ["　　　　　"],
        4: ["　　　　　"],
        5: ["　　　　　"],
        6: ["　　　　　"],
        7: ["　　　　　"],
        8: ["ゃゅょ"],
        9: ["　　　　　"],
        "#": ["　　　　"],
        "*": ["　　　　"],
    };
    return KTai10K;
})();
var StringReadingHelper = (function () {
    function StringReadingHelper(str, offset) {
        if (offset === void 0) { offset = 0; }
        this.str = str == null ? "" : str;
        this.offset = offset;
    }
    StringReadingHelper.prototype.read = function () {
        if (this.str.length < this.offset) {
            return null;
        }
        return this.str[this.offset++];
    };
    StringReadingHelper.prototype.peek = function () {
        if (this.str.length < (this.offset + 1)) {
            return null;
        }
        return this.str[this.offset + 1];
    };
    StringReadingHelper.prototype.getOffset = function () {
        return this.offset;
    };
    StringReadingHelper.prototype.setOffset = function (newOffset) {
        this.offset = newOffset;
    };
    return StringReadingHelper;
})();
