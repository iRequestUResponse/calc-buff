Vue.component('equipment-component', {
    template: '#equipmentComponent',
    props: ['equipmentData', 'currentEquipments', 'proc']
});

Vue.component('calc-proc-component', {
    template: '#calcProcComponent',
    props: ['proc']
});

let vm = new Vue({
    el: '#app',
    data: {
        model: {},
        equipments: {
            영축: [],
            용축: [],
            아포: [],
            크오빅: []
        },
        proc: [{
            name: '영축',
            stat: null,
            check: true
        }, {
            name: '용축',
            stat: null,
            check: false
        }, {
            name: '아포',
            stat: null,
            check: false
        }, {
            name: '크오빅',
            stat: null,
            check: false
        }]
    }
})

dbRead('/shield').then(function(data) {
    vm._data.model = data.val();
    for (let e in vm._data.model.equipment) {
        for (let ee in vm._data.equipments) {
            vm._data.equipments[ee].push({
                partsName: e,
                name: '',
                ab: [],
                set: null,
                show: false
            });
        }
    }
});

function closeAll() {
    for (let e in vm._data.equipments) {
        for (let ee in vm._data.equipments[e])
            vm._data.equipments[e][ee].show = false;
    }
}

function getProc() { //영축, 용축, 아포, 크오빅 중 하나 반환
    let _proc = vm.proc;
    for (let e in _proc) {
        if (_proc[e].check) {
            return _proc[e].name;
        }
    }
}

function getAB(STR) {
    let keyword = STR.split(/ +/);

    return {
        firstKey: keyword[0],
        secondKey: keyword[1],
        val: /[0-9]*/.exec(keyword[2])[0],
        isP: /%/.test(keyword[2])
    };
}

let buff = {
    stat: 0,
    name: "",
    level: 0,
    factor: function() {
        let map = {
            영축: 630,
            용축: 700,
            아포: 750,
            크오빅: 830
        }

        return map[this.name];
    },
    type: 'male',
    ability: [],
    // 아리아 25% 잊지 말자
    init: function() {
        let _proc = getProc();
        let mapSkill = {};
        for (let e in vm.model.skill) {
            mapSkill[vm.model.skill[e].name] = e;
        }

        let mapStat = {
            영축: "체정",
            아포: "체정",
            용축: "지능",
            크오빅: "지능"
        };

        let eq = vm.equipments[_proc];
        let setInfo = vm.model.set;
        // let setII = {};
        // for (let e in setInfo) {
        //     if (!setII[setInfo.name]) setII[setInfo.name] = 0;
        //     setII[setInfo.name]++;
        // }

        // let ab_s = [];
        // 정리 안 됨 ㅠ

        // ability 정리(세트 포함)
        for (let e in eq) {
            for (let ee in eq[e].ab) {
                ab_s.push(eq[e].ab[ee]);

            }
        }

        // 레벨 초기화
        this.level = vm.model.skill[mapSkill[_proc]].startlevel;
        let passiveLevel = {
            보징: 0,
            신념: 0,
            디바인: 0,
            열정: 0
        };
        for (let e in ab_s) {
            let _parse = getAB(ab_s[e]);
            if (_parse.firstKey === "스탯") continue;
            if (_parse.secondKey !== "레벨") continue;
            if (passiveLevel[_parse.firstKey]) passiveLevel[_parse.firstKey] += _parse.val;
            if (_parse.firstKey === _proc) this.level += _parse.val;
        }
    },
    getAbility: function() {
        // function ability() {
        //     return {
        //         statPlus: 0,

        //     }
        // }
        // this.ability = {
        //     statPlus: 0,
        //     statPercent: 0,
        //     skillLevel: 0,
        //     skillPlus: {
        //         힘: 0,
        //         지능: 0,
        //         물공: 0,
        //         마공: 0,
        //         독공: 0
        //     },
        //     skillPercent: {
        //         힘: 0,
        //         지능: 0,
        //         물공: 0,
        //         마공: 0,
        //         독공: 0
        //     }
        // };
        // let eq = vm._data.equipments;
        // let _proc = getProc(vm.proc);
        // for (let e in vm.proc) {
        //     if (vm.proc[e].check) {
        //         this.stat = vm.proc[e].stat;
        //         this.name = vm.proc[e].name;
        //         for (let ee in vm.model.skill) {
        //             if (vm.model.skill[e].name === this.name) {
        //                 this.level = vm.model.skill[e].startlevel;
        //                 break;
        //             }
        //         }
        //         break;
        //     }
        // }

        // for (let e in eq[_proc]) {
        //     let abArray = eq[_proc][e].ab;

        //     for (let ee in abArray) {
        //         this.abToTruth(abArray[ee], _proc);
        //         // console.log(abArray[ee], typeof abArray[ee]);
        //     }
        // }

        // console.log(this.name, this.stat, this.level, this.factor())
    },
    abToTruth: function(_string, _proc_) {
        // let _ab = getAB(_string);
        // let map = {
        //     영축: "체정",
        //     용축: "지능",
        //     아포: "체정",
        //     크오빅: "지능"
        // };
        // if (_ab.isP) { // precent일 경우
        //     if (_ab.skillName === "스탯") { //
        //         if (_ab.statName === map[_proc_]) {
        //             this.ability.statPercent += _ab.val;
        //         }
        //     } else if (_ab.skillName === _proc_) { // 스킬 이름일 경우(영축, 용축, 아포, 크오빅 중 하나)
        //         switch (_ab.statName) {
        //             case "힘":
        //             case "지능":
        //             case "물공":
        //             case "마공":
        //             case "독공":
        //                 this.ability.skillPercent[_ab.statName] += _ab.val;
        //                 break;
        //             case "힘지":
        //                 this.ability.skillPercent["힘"] += _ab.val;
        //                 this.ability.skillPercent["지능"] += _ab.val;
        //                 break;
        //             case "물마공":
        //                 this.ability.skillPercent["물공"] += _ab.val;
        //                 this.ability.skillPercent["마공"] += _ab.val;
        //                 break;
        //             case "물마독":
        //                 this.ability.skillPercent["물공"] += _ab.val;
        //                 this.ability.skillPercent["마공"] += _ab.val;
        //                 this.ability.skillPercent["독공"] += _ab.val;
        //                 break;
        //         }
        //     } else { // 스킬 이름인데 영축, 용축, 아포, 크오빅이 아닐 경우

        //     }
        // } else {
        //     if (_ab.skillName === "스탯") { // 

        //     } else if (_ab.skillName === _proc_) { // 스킬 이름일 경우(영축, 용축, 아포, 크오빅 중 하나)

        //         // _ab.statName
        //         // _ab.val
        //     } else { // 스킬 이름인데 영축, 용축, 아포, 크오빅이 아닐 경우

        //     }
        // }
    },
    // getSkill: function() {

    // },
    // getStat: function() {
    //     let stat = Number(this.stat);
    //     let statPercent = 1;

    //     for (let e in this.equipments) {
    //         if (e.ab) {
    //             let _ab = getAB(e.ab);

    //             if (_ab.skillName === "스탯") {
    //                 let map0 = {
    //                     영축: "체정",
    //                     용축: "지능",
    //                     아포: "체정",
    //                     크오빅: "지능"
    //                 }

    //                 if (_ab.statName === map0[this.name]) {
    //                     if (_ab.isP) {
    //                         statPercent += _ab.val;
    //                     } else {
    //                         stat += _ab.val;
    //                     }
    //                 }
    //             } else {
    //                 let map1 = {

    //                 }
    //             }
    //         }
    //     }
    //     // 스킬 레벨 올리기
    //     // 스킬 주스탯 올리기
    //     // 주스탯 올리기
    //     // 원래 주스탯에 스킬 주스탯 올리기
    //     // 원래 주스탯에 장비 주스탯 올리기
    //     // 원래 주스탯에 장비 주스탯 곱하기
    // }
};