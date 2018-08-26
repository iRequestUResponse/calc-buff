let equipment = {
        left: {
            "어깨": [],
            "상의": [],
            "하의": [],
            "허리": [],
            "신발": []
        },
        right1: {
            "무기": [],
            "칭호": [],
            "팔찌": [],
            "목걸이": [],
            "반지": []
        },
        right2: {
            "보조장비": [],
            "귀걸이": [],
            "마법석": []
        }
    },

    selectedSkill = 0,

    skill = {
        "영광의 축복": {
            factor: 630,
            buff: {
                "힘": [],
                "지능": [],
                "물리 공격력": [],
                "마법 공격력": [],
                "독립 공격력": []
            }
        },
        "용맹의 축복": {
            factor: 700,
            buff: {
                "힘": [],
                "지능": [],
                "물리 공격력": [],
                "마법 공격력": [],
                "독립 공격력": []
            }
        },
        "아포칼립스": {
            factor: 750,
            buff: {
                "힘": [],
                "지능": []
            }
        },
        "크럭스 오브 빅토리아": {
            factor: 830,
            buff: {
                "힘": [],
                "지능": []
            }
        }
    },

    calcBuff = {
        stat: 0,
        level: 0,
        pStat: 0,
        mStat: 1,
        pBuff: 0,
        mBuff: 1,
        result: {},

        calc: function(s) {
            let targets = skill[s];

            this.result = {};

            for (let e in targets.buff) {
                let _target = targets.buff[e];
                if (typeof(_target) !== 'object') continue;
                this.result[e] = (1 + (this.stat + this.pStat) * this.mStat / targets.factor) * (_target[this.level - 10] + this.pBuff) * this.mBuff;
                this.result[e] = Math.round(this.result[e]);
            }

            // return result;
        },
        init: function() {
            this.pStat = 0;
            this.mStat = 1;
            this.pBuff = 0;
            this.mBuff = 1;
        },
        apply: function(t, v) {
            if (t.toLowerCase() === 'a') {
                this.pStat += v;
            } else if (t.toLowerCase() === 'b') {
                this.mStat += v;
            } else if (t.toLowerCase() === 'c') {
                this.pBuff += v;
            } else if (t.toLowerCase() === 'd') {
                this.mBuff += v;
            } else console.error('wrong args');
        }
    },

    visibility = [];

let vm = new Vue({
    el: '#app',
    data: {
        equipment,
        // equipments: [],
        skill,
        calcBuff,
        selectedSkill
    }
})

function closeMenu() {
    for (let e in visibility) {
        visibility[e].eVisible = false;
    }
}

dbRead('/').then(data => {
    let _data = data.val().shield.equipment;

    for (let e in equipment) {
        for (let ee in equipment[e]) {
            equipment[e][ee] = _data[ee];
        }
    }
})