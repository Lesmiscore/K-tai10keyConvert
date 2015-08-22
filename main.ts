class KTai10K {
    /*
    "(" means "濁点"
    ")" means "半濁点"
    " " means big/small change
    "-" means cancel changing
    */
    static encodeData = {
        0: ["わをん"],//0
        1: ["あいうえお"],//1
        2: ["かきくけこ"],//2
        3: ["さしすせそ"],//3
        4: ["たちつてと"],//4
        5: ["なにぬねの"],//5
        6: ["はひふへほ"],//6
        7: ["まみむめも"],//7
        8: ["やゆよ"],//8
        9: ["らりるれろ"],//9
        "#": ["() -"],//#
        "*": ["、。？！"],//*
    };
    static dakuten = {
        0: ["　　　"],//0
        1: ["　　　　　"],//1
        2: ["がぎぐげご"],//2
        3: ["ざじずぜぞ"],//3
        4: ["だぢづでど"],//4
        5: ["　　　　　"],//5
        6: ["ばびぶべぼ"],//6
        7: ["　　　　　"],//7
        8: ["　　　"],//8
        9: ["　　　　　"],//9
        "#": ["　　　　"],//#
        "*": ["　　　　"],//*
    };
    static handakuten = {
        0: ["　　"],//0
        1: ["　　　　　"],//1
        2: ["　　　　　"],//2
        3: ["　　　　　"],//3
        4: ["　　　　　"],//4
        5: ["　　　　　"],//5
        6: ["ぱぴぷぺぽ"],//6
        7: ["　　　　　"],//7
        8: ["　　"],//8
        9: ["　　　　　"],//9
        "#": ["　　　　"],//#
        "*": ["　　　　"],//*
    };
    static sutegana = {
        0: ["ゎ　　"],//0
        1: ["ぁぃぅぇぉ"],//1
        2: ["　　　　　"],//2
        3: ["　　　　　"],//3
        4: ["　　　　　"],//4
        5: ["　　　　　"],//5
        6: ["　　　　　"],//6
        7: ["　　　　　"],//7
        8: ["ゃゅょ"],//8
        9: ["　　　　　"],//9
        "#": ["　　　　"],//#
        "*": ["　　　　"],//*
    };
    public static numberToHiragana(num: string): string {
        var read = new StringReadingHelper(num);
        var buf = "";
        var nowNum = read.read();
        var nowCount = 0;
        while (read.peek() !== null) {
            var now = read.read();
            if (nowNum == now) {
                nowCount++;
            } else {
                buf += KTai10K.encodeData[nowNum][nowCount];
                nowNum = read.read();
                nowCount = 1;
            }
            return KTai10K.pack(buf);
        }
    }
    private static pack(text: string): string {
        var read = new StringReadingHelper(text);
        var res = "";
        var ignoreSpecial = false;
        while (read.peek() !== null) {
            var now = read.read();
            if (res == "") {
                res += now;
            } else {
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
                        res += now;
                        continue;
                 }
            }
        }
        return res;
    }
}
class StringReadingHelper {
    private str: string;
    private offset: number;
    constructor(str: string, offset: number = 0) {
        this.str = str == null ? "" : str;
        this.offset = offset;
    }
    public read(): string {
        if (this.str.length < this.offset) {
            return null;
        }
        return this.str[this.offset++];
    }
    public peek(): string {
        if (this.str.length < (this.offset + 1)) {
            return null;
        }
        return this.str[this.offset + 1];
    }
    public getOffset(): number {
        return this.offset;
    }
    public setOffset(newOffset: number): void {
        this.offset = newOffset;
    }
}