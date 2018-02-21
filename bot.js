var Discord = require('discord.io');
var logger = require('winston');
const selfID = 395133280170541056;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: process.env.BOT_TOKEN,
    autorun: true
});

bot.on('ready', function () {
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    bot.setPresence({
        game: {
            name: "소전 명령어"
        }
    });
});

bot.on('message', function (user, userID, channelID, message, evt) {

    // logger.debug("onMessage("+message+");");
    var args = message.split(' ');
    var callName = args[0];
    var name; var link = null;

    if (callName == "소전" || callName == "소녀전선") {

        args.splice(0, 1);

        var first = args[0];
        var second = args[1];
        var time = parseTime(args);
        var heavy;

        if (!isNaN(time)) {

            // 인형제조 테이블 (전부)
            // 소전 %d

            write(bot, channelID, parseDoll(time, null));

        } else if (hearCoinToss(args)) {

            // 소전 코인토스

            coinCall(bot, channelID);

        } else {

            args.splice(0, 1);
            time = parseTime(args);
            switch (first) {

                // 인형제조 테이블 (전부)
                // 소전 인형 %d

                case "인형":
                    write(bot, channelID, parseDoll(time, null));
                    break;

                // 인형제조 테이블 (일반)
                // 소전 일반 %d

                case "일반":
                case "보통":
                    write(bot, channelID, parseDoll(time, false));
                    break;

                // 인형제조 테이블 (중제)
                // 소전 중제 %d

                case "중제":
                case "중형":
                case "중형제조":
                    write(bot, channelID, parseDoll(time, true));
                    break;

                // 장비제조 테이블
                // 소전 장비 %d

                case "장비":
                case "요정":
                    write(bot, channelID, parseEquip(time));
                    break;

                case "봇_체인지로그":
                    changelog(bot, channelID);
                    break;

                case "봇_시간표":
                    timetable(bot, channelID);
                    break;

                // 명령어 목록
                // 소전 명령어

                case "명령어":
                case "도움":
                    help(bot, channelID);
                    break;

            }
        }

     } else if (hearCoinToss(args)) {

        // (코인토스)

        if (userID == selfID) coinTossOfDestiny(bot, channelID);
        else coinCall(bot, channelID);

     }

});

function parseTime(args) {

    var first = args[0];
    var timePattern = /^[0-9]:[0-9]{2}$/

    if (!isNaN(first)) return parseInt(first);
    else if (timePattern.test(first)) {
        var timeString = first.match(timePattern)[0].split(':');
        return parseInt(timeString[0]) * 100 + parseInt(timeString[1]);
    } else {
        return parseInt(first) * 100 + parseInt(args[1]);
    }
}

function coinCall(bot, channelID) {
    write(bot, channelID, "운명의 코인토스!");
}

function hearCoinToss(args) {
    var first = args[0];
    var second = args[1];
    var third = args[2];

    // logger.debug("hearCoinToss("+args.toString()+");");

    // 운명의 코인토스!
    // (동전) (던지기)?
    // 코인토스 !(던지기)

    if (first == "운명의" && second == "코인토스!" && third == null) {

        return true;

    } else if (first == "코인" || first == "동전") {

        if (second == "던지기" || second == null) {
            return true;
        }

    } else if (first == "코인토스" && second != "던지기") {

        return true;

    } else return false;

}

function parseDoll(time, heavy) {
    var name;

    logger.debug("parseDoll("+time+", "+heavy+");");

    if (heavy && time <= 130) {

        // 중제 기본 조건: 3성 보장, 권총 없음

        name = invalidAsHeavy();

    } else if (heavy == false && time >= 715) {

        // 샷건: 중제 한정

        name = invalidAsLight();

    } else switch(time) {
        case 20:
            name = "1911, 나강, P38";
            break;

        case 22:
            name = "PPK";
            break;

        case 25:
            name = "FNP-9, MP-446";
            break;

        case 28:
            name = "USP 컴팩트, 브렌 텐";
            break;

        case 30:
            name = "P08, C96";
            break;

        case 35:
            name = "92식, P99";
            break;

        case 40:
            name = "아스트라, M9, 마카로프";
            break;

        case 45:
            name = "토카레프";
            break;

        case 50:
            name = "콜라, 참피";
            break;

        case 52:
            name = "스핏파이어";
            break;

        case 55:
            name = "삐칠, 스텟";
            break;

        case 100:
            name = "웰로드";
            break;

        case 102:
            name = "컨텐더";
            break;

        case 105:
            name = "캘리코, 은지";
            break;

        case 110:
            name = "그리즐리, IDW, PP-2000";
            break;

        case 120:
            name = "스펙터, 시나몬롤";
            break;

        case 125:
            name = "64식";
            break;

        case 130:
            name = "MP40, 베레타 38, M3";
            break;

        case 140:
            name = "스텐, 우지";
            break;

        case 150:
            // 파파샤는 2성
            if (heavy == null) name = "F1(중), 파파샤";
            else if (heavy) name = "F1";
            else name = "파파샤";
            break;

        case 200:
            name = "잉그램, 사소리";
            break;

        case 205:
            if (heavy == null) name = "Z-62(중)";
            else if (heavy) name = "Z-62";
            else name = invalidAsLight();
            break;

        case 210:
            name = "핑파샤";
            break;

        case 215:
            name = "움뀨, 움사오";
            break;

        case 218:
            name = "시프카, 1901";
            break;

        case 220:
            name = "우유, 란코";
            break;

        case 225:
            name = "수오미";
            break;

        case 230:
            name = "톰슨, 지상렬씨";
            break;

        case 233:
            name = "포돌이";
            break;

        case 235:
            name = "벡터, 79식";
            break;

        case 240:
            if (heavy) name = invalidAsHeavy();
            else name = "갈릴, 시그";
            break;

        case 245:
            if (heavy) name = invalidAsHeavy();
            else name = "F2000, 63식";
            break;

        case 250:
            if (heavy) name = invalidAsHeavy();
            else name = "장미, G3";
            break;

        case 300:
            name = "서태지";
            break;

        case 310:
            if (heavy) name = "티스";
            else name = "티스(AR), G43, FN-49(RF)";
            break;

        case 320:
            if (heavy) name = "AK-47, FNC";
            else name = "AK-47, FNC(AR), BM59(RF)";
            break;

        case 325:
            name = "56-1식";
            break;

        case 330:
            if (heavy) name = "아스발, 파마스, 타보르";
            else name = "아스발, 파마스, 타보르(AR), 시모노프, 토카레프(RF)";
            break;

        case 335:
            name = "구아쟝";
            break;

        case 340:
            name = "G36, 리베롤(AR), 씹새, 에스베(RF)";
            break;

        case 345:
            name = "팔";
            break;

        case 348:
            name = "T91";
            break;

        case 350:
            if (heavy == null) name = "95식, 97식(AR), 한조, 도라지(중)(RF)";
            else if (heavy) name = "95식, 97식(AR), 한조, 도라지(RF)";
            else name = "95식, 97식(AR), 한조(RF)";
            break;

        case 352:
            name = "K2";
            break;

        case 355:
            name = "흥국";
            break;

        case 358:
            name = "라플비";
            break;

        case 400:
            name = "개런드";
            break;

        case 404:
            name = "잠탱";
            break;

        case 405:
            name = "댕댕, 자스타바";
            break;
        
        case 409:
            name = "안구사";
            break;

        case 410:
            name = "모신나강, T-5000";
            break;
            
        case 412:
            name = "마일리";
            break;

        case 415:
            name = "스브드";
            break;

        case 420:
            if (heavy == null) name = "피서지(중), 시금치(중)";
            else if (heavy) name = "피서지, 시금치";
            else name = invalidAsLight();
            break;

        case 425:
            name = "춘전";
            break;

        case 430:
            if (heavy == null) name = "남반구, 음악대장(중)";
            else if (heavy) name = "남반구, 음악대장";
            else name = "남반구";
            break;

        case 438:
            name = "카르카노 M1891 (언니)";
            break;

        case 440:
            name = "카구팔";
            break;

        case 442:
            name = "카르카노 M91/38 (동생)";
            break;

        case 445:
            name = "노태우";
            break;

        case 450:
            if (heavy) name = "와짱";
            else name = "와짱(RF), AAT, FG42(MG)";
            break;

        case 452:
            name = "이유식";
            break;

        case 455:
            name = "뀨뀨";
            break;

        case 500:
            if (heavy) name = "리엔필드";
            else name = "리엔필드(RF), MG34, DP28(MG)";
            break;

        case 510:
            if (heavy) name = invalidAsHeavy();
            else name = "람쥐";
            break;

        case 520:
            name = "브렌";
            break;

        case 540:
            name = "M1919A4";
            break;

        case 550:
            name = "MG42";
            break;

        case 610:
            name = "M60, M2HB";
            break;

        case 615:
            name = "80식";
            break;

        case 620:
            name = "광년이, 비둘기";
            break;

        case 625:
            name = "바짱, 아멜리";
            break;

        case 630:
            name = "피케, 망3";
            break;

        case 635:
            name = "네게브";
            break;

        case 640:
            name = "망포";
            break;

        case 645:
            name = "망파";
            break;

        case 650:
            name = "페체네크";
            break;

        case 715:
            name = "NS2000";
            break;

        case 720:
            name = "샷댕";
            break;

        case 725:
            name = "상어";
            break;

        case 730:
            name = "RMB, M1897";
            break;

        case 740:
            name = "M590, 스파스";
            break;

        case 745:
            name = "이사카";
            break;

        case 750:
            name = "쇼티";
            break;

        case 755:
            name = "우사스";
            break;

        case 800:
            name = "김성근";
            break;

        case 805:
            name = "사이가";
            break;

        case 810:
            name = "삿팔";
            break;

        default:
            name = noSuchTime();
            break;
    }
    return name;
}

function parseEquip(time) {

    logger.debug("parseEquip("+time+");");

    switch (time) {
        case 5: return "2성 옵티컬";
        case 7: return "2성 소음기";
        case 8: return "2성 이오텍";
        case 9: return "2성 야시장비";
        case 10: return "2성 레드닷";

        case 12: return "2성 외골격";
        case 13: return "2성 HP탄";
        case 14: return "2성 산탄";
        case 15: return "2성 철갑탄";

        case 16: return "2성 수트";
        case 18: return "2성 고속탄";
        case 20: return "3성 옵티컬";

        case 22: return "3성 소음기";
        case 23: return "3성 이오텍";
        case 24: return "3성 야시장비";
        case 25: return "3성 레드닷";

        case 26: return "3성 삽판";
        case 27: return "3성 외골격";
        case 28: return "3성 HP탄";
        case 29: return "3성 산탄";
        case 30: return "3성 철갑탄";

        case 31: return "3성 수트";
        case 33: return "3성 고속탄";
        case 35: return "4성 옵티컬";

        case 37: return "4성 소음기";
        case 38: return "4성 이오텍";
        case 39: return "4성 야시장비";
        case 40: return "4성 레드닷";

        case 41: return "4성 삽판";
        case 42: return "4성 외골격";
        case 43: return "4성 HP탄";
        case 44: return "4성 산탄";
        case 45: return "4성 철갑탄, 5성 옵티컬";

        case 46: return "4성 수트";
        case 47: return "5성 소음기, 4성 탄통";
        case 48: return "4성 고속탄, 5성 이오텍";
        case 49: return "5성 야시장비";
        case 50: return "5성 레드닷";

        case 51: return "5성 삽판";
        case 52: return "5성 외골격";
        case 53: return "5성 HP탄";
        case 54: return "5성 산탄";
        case 55: return "5성 철갑탄";

        case 56: return "5성 수트";
        case 57: return "5성 탄통";
        case 58: return "5성 고속탄";

        case 300: return "방패요정";
        case 305: return "수호요정";
        case 310: return "도발요정";
        case 330: return "저격요정";
        case 335: return "포격요정";
        case 340: return "공습요정";

        case 400: return "증원요정";
        case 405: return "공수요정";
        case 410: return "방어요정";
        case 430: return "용사요정";
        case 435: return "격노요정";

        case 500: return "지휘요정";
        case 505: return "수색요정";
        case 510: return "조명요정";
        case 530: return "매설요정";
        case 535: return "로켓요정";
        case 540: return "공사요정";

        default: return noSuchTime();
    }
}

function invalidAsHeavy() {
    var random = Math.random() * 2;
    if (random < 1) {
        return "중형제조는 해당 시간이 나오지 않습니다.";
    } else {
        return "중제 옵션을 빼고 다시 검색하시겠습니까?";
    }
}

function invalidAsLight() {
    var random = Math.random() * 2;
    if (random < 1) {
        return "일반제조는 해당 시간이 나오지 않습니다.";
    } else {
        return "일반 옵션을 빼고 다시 검색하시겠습니까?";
    }
}

function noSuchTime() {
    var random = Math.random() * 10;
    if (random < 1) {
        return "해당하는 데이터가 없습니다. 문제가 지속되면 개발자에게 문의주십시오."
    } else {
        return "해당 시간의 데이터가 없습니다.";
    }
}

function write(bot, channelID, content) {
    bot.sendMessage({
        to: channelID,
        message: content.toString()
    });
    // logger.debug("write("+content+");");
}

function coinTossOfDestiny(bot, channelID) {
    var coin = Math.random();
    var content;
    var result;
    if (coin < 0.5) {
        result = "앞면";
    } else {
        result = "뒷면";
    }
    // logger.debug("coinToss: "+result);
    var coin = Math.random() * 3;
    if (coin < 1) {
        content = "동전은 "+result+subjective(true)+" 나왔다!";
    } else if(coin < 2) {
        content = result+objective(true)+" 가리키고 있다...";
    } else {
        content = coinDescriptive(result == "앞면")+". "+result+"이다.";
    }
    write(bot, channelID, content);
}

function changelog(bot, channelID) {
    bot.sendMessage({
        to: channelID,
        embed: {
            color: 16777215,
            title: "IOP 봇 체인지로그",
            url: "https://github.com/Nullsp4ce/iop-bot/blob/master/Changelog.md",
            description: "v0.5.1",
            fields: [{
                name: "명령어 목록",
                value: "`소전 명령어`로 명령어 목록을 볼 수 있습니다. 봇의 상태에도 쓰여있어요."
            }, {
                name: "체인지로그, 시간표 업데이트 기록",
                value: "`소전 봇_체인지로그`, `소전 봇_시간표`는 각각 봇의 기능/시간표 업데이트 상황을 제공합니다."
            }],
            footer: {
                text: "IOP Bot by Nullspace#5289"
            }
        }
    })
}

function timetable(bot, channelID) {
    bot.sendMessage({
        to: channelID,
        embed: {
            color: 16777215,
            title: "IOP 봇 시간표 업데이트 기록",
            url: "https://github.com/Nullsp4ce/iop-bot/blob/master/TimetableUpdate.md",
            description: "최근 추가: 2018.2.20",
            fields: [{
                name: "리벨리온 소대: AN-94(안구사), AK-12(마일리)",
                value: "4:09 안구사 (5★ AR), 4:12 마일리 (5★ AR)"
            }],
            footer: {
                text: "IOP Bot by Nullspace#5289"
            }
        }
    })
}

function help(bot, channelID) {
    bot.sendMessage({
        to: channelID,
        embed: {
            color: 16777215,
            title: "IOP 봇 명령어 목록",
            description: "모든 명령은 `소전`으로 시작합니다. 여기서는 생략합니다.\n명령어 별칭을 포함한 완전한 정보는 [깃헙 링크](https://github.com/Nullsp4ce/iop-bot/blob/master/README.md)를 참조하십시오.",
            fields: [{
                name: "`(시간)`",
                value: "해당 제조시간의 인형을 검색합니다. 괄호는 제외하십시오.\n시간은 h:mm, hmm, h시간 m분 모두 가능합니다."
            }, {
                name: "`일반 (시간)`",
                value: "일반제조 환경 하에서 해당 제조시간의 인형을 검색합니다."
            }, {
                name: "`중제 (시간)`",
                value: "중형제조 환경 하에서 해당 제조시간의 인형을 검색합니다."
            }, {
                name: "`장비 (시간)` `요정 (시간)`",
                value: "해당 제조시간의 장비 **또는 요정**을 검색합니다."
            }, {
                name: "`운명의 코인토스!`",
                value: "`소전`으로 시작하지 않아도 작동합니다."
            }, {
                name: "`명령어` `도움`",
                value: "이 명령어 목록입니다."
            }, {
                name: "`봇_체인지로그`",
                value: "기능 체인지로그를 표시합니다."
            }, {
                name: "`봇_시간표`",
                value: "시간표 업데이트 현황을 표시합니다."
            }],
            footer: {
                text: "IOP Bot by Nullspace#5289"
            }
        }
    })
}

function coinDescriptive(head) {
    return head? "사람": "숫자";
}

function objective(base) {
    return base? "을": "를";
}

function subjective(base) {
    return base? "이": "가";
}
